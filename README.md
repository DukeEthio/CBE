***Student Payment API***
A simple REST API for managing student fee payments, tracking payment statuses, and handling penalties. The API supports basic authentication and allows for CRUD operations related to students and school account balances.

****Features****
- Student Management: List all students, retrieve individual student details, and check their payment status.
- Payment Processing: Allows for simulating student fee payments and applying penalties for late payments.
- School Account: View the current balance of the school's account.
- Authentication: Basic Authentication is required to access the API.

****Endpoints****
**1. GET /api/students**

Description: Fetches the list of all students along with their fee details and payment status.

Response:

[
  {
    "id": 1,
    "name": "Abrham",
    "feeAmount": 1000,
    "paymentStatus": false
  },
  {
    "id": 2,
    "name": "Mekuriaw",
    "feeAmount": 1200,
    "paymentStatus": false
  },
  ...
]

**2. GET /api/student/{id}**

Description: Retrieves a student's fee details and payment status by their ID.
Parameters:
id: The ID of the student.

Response:
Paid Student:

{
  "message": "Payment successfully processed",
  "student": {
    "id": 1,
    "name": "Abrham",
    "feeAmount": 1000,
    "paymentStatus": true
  }
}

Unpaid Student:

{
  "message": "Not paid",
  "student": {
    "id": 2,
    "name": "Mekuriaw",
    "feeAmount": 1200,
    "paymentStatus": false
  }
}

- Error Response (Student Not Found):

{
  "error": "There is no student named by that ID"
}

**3. GET /api/school/balance**

Description: Fetches the current balance of the school's account.

Response:
{
  "accountNo": "12345",
  "balance": 2000,
  "currency": "Birr"
}

**4. POST /api/payment/create**

Description: Processes a student payment and updates their payment status. The request should include the student's ID, the payment amount, and the payee's name.

Parameters:

studentId: The ID of the student making the payment.
paymentAmount: The total payment amount, including any penalties if applicable.
payeeName: The name of the person making the payment (student or guardian).

Request Example (On-Time Payment):

{
  "studentId": 1,
  "paymentAmount": 1000,
  "payeeName": "John Doe"
}

Request Example (Late Payment with Penalty):

{
  "message": "Payment successful",
  "paymentResponse": {
    "status": "succeeded",
    "message": "Payment for Abrham was successful",
    "studentName": "Abrham",
    "payeeName": "John Doe",
    "amount": 1000,
    "currency": "Birr",
    "paymentDate": "15-11-2024"
  }
}

- Error Response (Insufficient Funds):

{
  "error": "Insufficient funds in school account"
}

- Error Response (Invalid Payment Amount):

{
  "error": "Payment amount must be 1000 Birr"
}

- Error Response (Student Not Found):

{
  "error": "Student not found"
}

**Authentication**

Basic Authentication: All /api/ routes require Basic Authentication with the following credentials:
Username: admin
Password: password
You can use tools like Postman

****How to Set Up********

**1. Clone the repository:**

```sh
git clone https://gitlab.cbe.com.et/MesfinMitikie/ifb_training/schoolpaysys.git (https://github.com/DukeEthio/CBE.git)
cd schoolpaysys
