export interface Employee {
    id: number;
    full_name: string;
    email: string;
    department: string;
    created_at: string;
}

export interface Attendance {
    id: number;
    employee_id: number;
    date: string;
    status: "Present" | "Absent";
}

export interface DashboardSummary {
    total_employees: number;
    present_today: number;
    absent_today: number;
}
