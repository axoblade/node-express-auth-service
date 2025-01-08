# Authentication and Authorization Service

This project is an **Authentication and Authorization Service** built with **Node.js**, **Express.js**, **Prisma**, and **MySQL**. It supports robust user authentication, role-based access control, and tag-based user and role grouping for advanced permissions management.

---

## **Features**

### **Core Features**

- User account creation and management.
- Email verification.
- Login with 2FA (Two-Factor Authentication via email OTP).
- Password reset functionality.
- Role-based access control (RBAC).
- Permissions management.
- Tag-based user and role grouping.

### **Admin Features**

- Manage users, roles, and tags.
- Assign roles to users.
- Assign permissions to roles.
- Assign tags to users and roles.
- View all users, roles, and permissions.
- Activate, deactivate, and delete users.

---

## **Project Structure**

```plaintext
src/
├── config/
│   └── prisma.js          # Prisma client configuration
├── controllers/
│   ├── authController.js  # Handles authentication-related endpoints
│   ├── adminController.js # Handles admin-related endpoints
├── middleware/
│   └── authenticate.js    # Middleware for authentication
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── adminRoutes.js     # Admin routes
├── services/
│   ├── authService.js     # Business logic for authentication
│   ├── adminService.js    # Business logic for admin tasks
│   ├── tagService.js      # Business logic for tags
│   ├── notificationService.js # Email notifications
└── server.js              # Entry point for the application
```

---

## **Environment Variables**

Create a `.env` file in the root of your project and include the following variables:

```env
DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<database>"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="AdminPassword123"
```

---

## **Setup Instructions**

### **1. Install Dependencies**

```bash
npm install
```

### **2. Seed the Database**

```bash
node seed.js
```

### **3. Start the Server**

```bash
npm start
```

---

## **Endpoints**

### **Authentication Endpoints**

#### **Register a New User**

- **Method**: POST
- **URL**: `/auth/register`
- **Payload**:
  ```json
  {
  	"email": "user@example.com",
  	"password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "User registered successfully",
  	"user": {
  		"id": "unique_user_id",
  		"email": "user@example.com"
  	}
  }
  ```

#### **Login a User**

- **Method**: POST
- **URL**: `/auth/login`
- **Payload**:
  ```json
  {
  	"email": "user@example.com",
  	"password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "Login successful",
  	"token": "jwt_token"
  }
  ```

#### **Verify User Email**

- **Method**: POST
- **URL**: `/auth/verify-email`
- **Payload**:
  ```json
  {
  	"token": "verification_token"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "Email verified successfully"
  }
  ```

#### **Request Password Reset**

- **Method**: POST
- **URL**: `/auth/request-password-reset`
- **Payload**:
  ```json
  {
  	"email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "Password reset email sent"
  }
  ```

#### **Reset Password**

- **Method**: POST
- **URL**: `/auth/reset-password`
- **Payload**:
  ```json
  {
  	"token": "reset_token",
  	"newPassword": "newSecurePassword123"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "Password reset successfully"
  }
  ```

#### **Verify 2FA OTP**

- **Method**: POST
- **URL**: `/auth/verify-otp`
- **Payload**:
  ```json
  {
  	"otp": "123456"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "OTP verified successfully"
  }
  ```

### **Admin Endpoints**

#### **Retrieve All Users**

- **Method**: GET
- **URL**: `/admin/users`
- **Response**:
  ```json
  [
  	{
  		"id": "unique_user_id",
  		"email": "user@example.com",
  		"isActive": true,
  		"emailVerified": true,
  		"createdAt": "2024-01-01T00:00:00.000Z",
  		"updatedAt": "2024-01-02T00:00:00.000Z"
  	}
  ]
  ```

#### **Activate or Deactivate a User**

- **Method**: PUT
- **URL**: `/admin/users/status`
- **Payload**:
  ```json
  {
  	"userId": "unique_user_id",
  	"isActive": false
  }
  ```
- **Response**:
  ```json
  {
  	"message": "User status updated to inactive",
  	"user": {
  		"id": "unique_user_id",
  		"isActive": false
  	}
  }
  ```

#### **Delete a User**

- **Method**: DELETE
- **URL**: `/admin/users/:userId`
- **Response**:
  ```json
  {
  	"message": "User deleted successfully"
  }
  ```

#### **Create a Tag**

- **Method**: POST
- **URL**: `/admin/tags`
- **Payload**:
  ```json
  {
  	"name": "Team A"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "Tag created successfully",
  	"tag": {
  		"id": "unique_tag_id",
  		"name": "Team A"
  	}
  }
  ```

#### **Assign a Tag to a User**

- **Method**: POST
- **URL**: `/admin/tags/assign-to-user`
- **Payload**:
  ```json
  {
  	"userId": "unique_user_id",
  	"tagId": "unique_tag_id"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "Tag assigned to user successfully",
  	"user": {
  		"id": "unique_user_id",
  		"tags": [
  			{
  				"id": "unique_tag_id",
  				"name": "Team A"
  			}
  		]
  	}
  }
  ```

#### **Assign a Tag to a Role**

- **Method**: POST
- **URL**: `/admin/tags/assign-to-role`
- **Payload**:
  ```json
  {
  	"roleId": "unique_role_id",
  	"tagId": "unique_tag_id"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "Tag assigned to role successfully",
  	"role": {
  		"id": "unique_role_id",
  		"tags": [
  			{
  				"id": "unique_tag_id",
  				"name": "Team A"
  			}
  		]
  	}
  }
  ```

---

## **Testing**

### **Run Tests**

Run the following command to execute the test suite:

```bash
npm test
```

---

## **Contributing**

If you would like to contribute to this project, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## **License**

This project is licensed under the MIT License.
