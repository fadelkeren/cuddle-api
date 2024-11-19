const PROXY_URL = "https://proxy.cors.sh/";
const API_URL = "http://cuddle-api.ct.ws/?i=1";

async function fetchData() {
    try {
        const response = await fetch(`${PROXY_URL}${API_URL}`, {
            headers: {
                "x-cors-api-key": "temp_10af89f20f78f718be769c5a32a21050",
            },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


// Display data in a list
function displayData(data) {
    const list = document.getElementById("data-list");
    list.innerHTML = ""; // Clear the list
    data.forEach(item => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${item.name} - ${item.description}
            <button onclick="deleteData(${item.id})">Delete</button>
            <button onclick="editData(${item.id}, '${item.name}', '${item.description}')">Edit</button>
        `;
        list.appendChild(listItem);
    });
}

// Create new data
document.getElementById("create-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description })
        });

        if (response.ok) {
            fetchData(); // Refresh data
            alert("Data added successfully");
            this.reset(); // Reset form
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error adding data:", error);
        alert("Failed to add data.");
    }
});

// Delete data by ID
async function deleteData(id) {
    try {
        const response = await fetch(`${API_URL}&id=${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            fetchData(); // Refresh data
            alert("Data deleted successfully");
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting data:", error);
        alert("Failed to delete data.");
    }
}

// Edit data
function editData(id, name, description) {
    // Fill form with existing data
    document.getElementById("name").value = name;
    document.getElementById("description").value = description;

    // Change form submission to update mode
    document.getElementById("create-form").onsubmit = async function (e) {
        e.preventDefault();

        try {
            const newName = document.getElementById("name").value;
            const newDescription = document.getElementById("description").value;

            const response = await fetch(`${API_URL}&id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, description: newDescription })
            });

            if (response.ok) {
                fetchData(); // Refresh data
                alert("Data updated successfully");
                this.reset(); // Reset form
                this.onsubmit = null; // Restore to create mode
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Failed to update data.");
        }
    };
}

// Initial fetch when the page loads
fetchData();
