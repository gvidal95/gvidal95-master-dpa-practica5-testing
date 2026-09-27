export interface EmployeeRepositoryInterface {
    createEmployee(employeeData: any): Promise<any>;
    getEmployeeById(employeeId: string): Promise<any>;
    updateEmployee(employeeId: string, employeeData: any): Promise<any>;
    deleteEmployee(employeeId: string): Promise<void>;
    getAllEmployees(): Promise<any[]>;
}
