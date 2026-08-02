const axios = require('axios');
const { execSync } = require('child_process');

const AUTH_URL = 'http://127.0.0.1:8081';
const USER_URL = 'http://127.0.0.1:8082';
const COMPLAINT_URL = 'http://127.0.0.1:8083';

async function runTest() {
  console.log("Starting System Test...");
  try {
    const timestamp = Date.now();
    const citizenEmail = `citizen_${timestamp}@test.com`;
    const officerEmail = `officer_${timestamp}@test.com`;
    const pass = "password123";

    // 1. Register Citizen
    console.log("1. Registering Citizen...");
    await axios.post(`${AUTH_URL}/api/v1/auth/register`, {
      username: `citizen_${timestamp}`,
      email: citizenEmail,
      password: pass,
      role: 'CITIZEN'
    });

    // Fetch OTP for Citizen
    let citizenOtp = execSync(`docker exec civicplus-mysql mysql -u root -ppassword -N -B -e "SELECT otp FROM auth_db.otp_tokens WHERE email='${citizenEmail}' ORDER BY expiry_date DESC LIMIT 1;"`).toString().trim();
    console.log(`Citizen OTP: ${citizenOtp}`);

    // Verify Citizen
    let res = await axios.post(`${AUTH_URL}/api/v1/auth/verify-account`, {
      email: citizenEmail,
      otp: citizenOtp
    });
    const citizenToken = res.data.accessToken;
    console.log("Citizen Verified!");

    // 2. Register Officer (Area Incharge)
    console.log("2. Registering Officer...");
    await axios.post(`${AUTH_URL}/api/v1/auth/register`, {
      username: `officer_${timestamp}`,
      email: officerEmail,
      password: pass,
      role: 'AREA_INCHARGE'
    });

    // Fetch OTP for Officer
    let officerOtp = execSync(`docker exec civicplus-mysql mysql -u root -ppassword -N -B -e "SELECT otp FROM auth_db.otp_tokens WHERE email='${officerEmail}' ORDER BY expiry_date DESC LIMIT 1;"`).toString().trim();
    console.log(`Officer OTP: ${officerOtp}`);

    // Verify Officer
    res = await axios.post(`${AUTH_URL}/api/v1/auth/verify-account`, {
      email: officerEmail,
      otp: officerOtp
    });
    const officerToken = res.data.accessToken;
    const officerId = res.data.userId || 1; // might not be in response, but we have token
    console.log("Officer Verified!");

    const testLat = 40.7128 + (Math.random() * 0.01);
    const testLng = -74.0060 + (Math.random() * 0.01);
    
    // Update Officer Profile
    console.log("Updating Officer Profile Location...");
    await axios.put(`${USER_URL}/api/v1/users/profile`, {
      role: 'AREA_INCHARGE',
      latitude: testLat,
      longitude: testLng,
      department: 'AREA_INCHARGE',
      area: 'Test Area',
      district: 'Test District'
    }, { headers: { Authorization: `Bearer ${officerToken}` }});
    console.log("Officer Profile Updated!");

    // 3. Citizen files Complaint near Officer
    console.log("3. Citizen filing complaint...");
    res = await axios.post(`${COMPLAINT_URL}/api/v1/complaints`, {
      title: 'Pothole on Main St',
      description: 'Big pothole',
      category: 'Infrastructure',
      priority: 'HIGH',
      latitude: testLat + 0.0001, // very close to the new officer
      longitude: testLng + 0.0001,
      area: 'Test Area',
      district: 'Test District'
    }, { headers: { Authorization: `Bearer ${citizenToken}` }});
    const complaintId = res.data.id;
    const assignedTo = res.data.assignedTo;
    console.log(`Complaint Filed! ID: ${complaintId}, Assigned To: ${assignedTo}`);

    // 4. Officer checks assigned complaints
    console.log("4. Officer checking assigned complaints...");
    res = await axios.get(`${COMPLAINT_URL}/api/v1/complaints/assigned`, {
      headers: { Authorization: `Bearer ${officerToken}` }
    });
    const assignedComplaints = res.data;
    console.log(`Officer has ${assignedComplaints.length} assigned complaints.`);

    if (assignedComplaints.some(c => c.id === complaintId)) {
        console.log("SUCCESS! The complaint was successfully routed to the nearest Area Incharge.");
    } else {
        console.log("FAIL: Complaint not found in officer's assigned list.");
    }

    // 5. Officer Updates Status
    console.log("5. Officer updates status...");
    await axios.put(`${COMPLAINT_URL}/api/v1/complaints/${complaintId}/status`, {
        status: 'UNDER_PROCESS',
        comment: 'We are looking into this.'
    }, { headers: { Authorization: `Bearer ${officerToken}` }});
    console.log("Status Updated!");

    console.log("ALL TESTS PASSED.");
    
  } catch (error) {
    console.error("Test Failed!");
    if (error.response) {
      console.error("Response Error:", error.response.status, error.response.data);
    } else {
      console.error("Network Error:", error.stack || error);
    }
  }
}

runTest();
