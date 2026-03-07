import axios from 'axios';
import { Employee, Attendance, DashboardSummary } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getEmployees = async () => {
    const { data } = await api.get<Employee[]>('/employees/');
    return data;
};

export const createEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at'>) => {
    const { data } = await api.post<Employee>('/employees/', employeeData);
    return data;
};

export const deleteEmployee = async (id: number) => {
    await api.delete(`/employees/${id}`);
};

export const getDashboardSummary = async () => {
    const { data } = await api.get<DashboardSummary>('/dashboard/');
    return data;
};

export const getAttendance = async (employeeId: number) => {
    const { data } = await api.get<Attendance[]>(`/attendance/${employeeId}`);
    return data;
};

export const getAttendanceByDate = async (date: string) => {
    const { data } = await api.get<Attendance[]>(`/attendance/by-date/${date}`);
    return data;
};

export const markAttendance = async (attendanceData: Omit<Attendance, 'id'>) => {
    const { data } = await api.post<Attendance>('/attendance/', attendanceData);
    return data;
};

export default api;
