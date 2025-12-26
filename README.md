# Contact Form Application

This is a complete Contact Form application where users can send messages and an Admin can manage them.

## Features Application
1.  **Contact Form**: Users can submit their Name, Email, Subject, and Message.
2.  **Validation**: Checks if email is valid and message is long enough.
3.  **Admin Dashboard**: A private area to see all messages.
4.  **Secure Login**: **Only Admin** can access the dashboard using a specific email and password.
5.  **Manage Tickets**:
    *   **Resolve Ticket**: You can mark a ticket as "Resolved" to keep track of work.
    *   **Delete Button**: You can permanently delete spam or unwanted messages.

---

## How to Run the Application

You need **Node.js** installed on your computer.

### Step 1: Start the Server (Backend)
This handles saving and loading the data.

1.  Open a terminal/command prompt.
2.  Go to the server folder:
    ```bash
    cd server
    ```
3.  Install the packages (only need to do this once):
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    node index.js
    ```
    *It will say: "Server running on http://localhost:3000"*

### Step 2: Start the Website (Frontend)
This is what you see in the browser.

1.  Open a **new** terminal window.
2.  Go to the client folder:
    ```bash
    cd client
    ```
3.  Install the packages (only need to do this once):
    ```bash
    npm install
    ```
4.  Run the website:
    ```bash
    npm run dev
    ```
5.  Open the link shown (usually `http://localhost:5173`) in your browser.

---

## Admin Login Details
To test the Admin features (Resolve/Delete), use these details:

*   **Email:** `admin123@gmail.com`
*   **Password:** `adminsagar123`
