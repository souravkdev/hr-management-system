"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Trash2, Mail, Briefcase, Hash, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getEmployees, createEmployee, deleteEmployee } from "@/lib/api";
import { Employee } from "@/types";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [formError, setFormError] = useState("");

    const fetchEmployees = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (err: any) {
            setError("Failed to fetch employees. Please make sure the backend is running.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!fullName || !email || !department) {
            setFormError("All fields are required");
            return;
        }

        try {
            setIsSubmitting(true);
            await createEmployee({ full_name: fullName, email, department });
            setIsModalOpen(false);
            setFullName("");
            setEmail("");
            setDepartment("");
            await fetchEmployees(); // Refresh list
        } catch (err: any) {
            setFormError(err.response?.data?.detail || "Failed to create employee");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this employee?")) return;
        try {
            await deleteEmployee(id);
            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (err) {
            alert("Failed to delete employee");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Employees</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage your team members and their information.</p>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                            <UserPlus className="h-4 w-4" />
                            Add Employee
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateEmployee} className="space-y-4 mt-4">
                            {formError && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@company.com"
                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Department</label>
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                                >
                                    <option value="" disabled>Select a department</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Product">Product</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? "Saving..." : "Save Employee"}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

                {/* Toolbar / Search */}
                <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Data Table Area */}
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
                        <p className="mt-4 text-zinc-500 font-medium">Loading employees...</p>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <span className="text-red-600 font-bold text-xl">!</span>
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-1">Error Loading Data</h3>
                        <p className="text-zinc-500">{error}</p>
                        <button onClick={fetchEmployees} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">Try Again</button>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-1">No employees found</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto mb-6">Get started by adding your first employee to the management system.</p>
                        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                            <UserPlus className="w-4 h-4" />
                            Add First Employee
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold"><div className="flex items-center gap-2"><Hash className="w-4 h-4" /> ID</div></th>
                                    <th scope="col" className="px-6 py-4 font-semibold"><div className="flex items-center gap-2"><Users className="w-4 h-4" /> Name</div></th>
                                    <th scope="col" className="px-6 py-4 font-semibold"><div className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</div></th>
                                    <th scope="col" className="px-6 py-4 font-semibold"><div className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Department</div></th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {employees.map((employee) => (
                                    <tr key={employee.id} className="bg-white hover:bg-zinc-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-zinc-900">
                                            #{employee.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                                                    {employee.full_name.substring(0, 2)}
                                                </div>
                                                <span className="font-medium text-zinc-900">{employee.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-600">
                                            {employee.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                                                {employee.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(employee.id)}
                                                className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                title="Delete employee"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
