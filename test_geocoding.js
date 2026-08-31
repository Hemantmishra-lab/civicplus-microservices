const http = require('http');

async function request(method, path, data = null, token = null) {
    const url = `http://localhost:8080${path}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        body: data ? JSON.stringify(data) : undefined
    });
    
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Request failed: ${response.status} ${text}`);
    }
    
    // some endpoints return empty
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
}

async function runTest() {
    try {
        console.log("1. Registering Area Incharge (Officer) at Lat 28.7041, Lng 77.1025 (Delhi)...");
        const officerEmail = `officer_${Date.now()}@test.com`;
        await request('POST', '/api/v1/auth/register', {
            email: officerEmail,
            password: 'password123',
            role: 'AREA_INCHARGE'
        });

        console.log("2. Logging in as Officer to get token...");
        const officerLogin = await request('POST', '/api/v1/auth/login', {
            email: officerEmail,
            password: 'password123'
        });
        const officerToken = officerLogin.token;

        console.log("3. Updating Officer Profile with Location...");
        await request('POST', '/api/v1/users/profile', {
            firstName: 'Officer',
            lastName: 'Delhi',
            latitude: 28.7041,
            longitude: 77.1025,
            role: 'AREA_INCHARGE'
        }, officerToken);

        console.log("4. Registering Citizen...");
        const citizenEmail = `citizen_${Date.now()}@test.com`;
        await request('POST', '/api/v1/auth/register', {
            email: citizenEmail,
            password: 'password123',
            role: 'CITIZEN'
        });

        console.log("5. Logging in as Citizen...");
        const citizenLogin = await request('POST', '/api/v1/auth/login', {
            email: citizenEmail,
            password: 'password123'
        });
        const citizenToken = citizenLogin.token;

        console.log("6. Creating a Complaint as Citizen very close to the Officer (Lat 28.7042, Lng 77.1026)...");
        const complaint = await request('POST', '/api/v1/complaints', {
            title: 'Water leak',
            description: 'There is a huge water leak here.',
            category: 'WATER',
            latitude: 28.7042,
            longitude: 77.1026,
            priority: 'HIGH'
        }, citizenToken);

        console.log("Complaint Created successfully:");
        console.log(complaint);

        if (complaint.assignedTo !== null) {
            console.log(`✅ SUCCESS! Complaint was auto-assigned to officer ID: ${complaint.assignedTo}`);
            // Let's verify it matches the officer we just created
            const officerProfile = await request('GET', '/api/v1/users/profile', null, officerToken);
            if (officerProfile.userId === complaint.assignedTo) {
                console.log(`✅ MATCH! Assigned to the correct nearest officer we created.`);
            } else {
                console.log(`⚠️ ASSIGNED, but to officer ${complaint.assignedTo}, not the one we just created (${officerProfile.userId}). Maybe there was another closer officer in DB.`);
            }
        } else {
            console.log("FAILED! Complaint was not auto-assigned. assignedTo is null.");
        }

    } catch (e) {
        console.error("Test failed with error:");
        console.error(e);
    }
}

runTest();
