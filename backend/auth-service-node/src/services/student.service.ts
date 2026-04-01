import axios from 'axios';

export class StudentService {
  private studentServiceUrl: string;

  constructor() {
    this.studentServiceUrl = process.env.STUDENT_SERVICE_URL || 'http://localhost:8083';
  }

  async createStudent(studentData: any) {
    try {
      const response = await axios.post(
        `${this.studentServiceUrl}/api/students`,
        studentData
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to create student:', error.message);
      throw error;
    }
  }

  async getStudent(userId: string) {
    try {
      const response = await axios.get(
        `${this.studentServiceUrl}/api/students/user/${userId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to get student:', error.message);
      throw error;
    }
  }
}
