import { CheckCircle, XCircle, Clock } from "lucide-react";

export const statusOptions = [
    { value: "available", label: "Available", color: "bg-green-100 text-green-700", icon: CheckCircle },
    { value: "sold", label: "Sold", color: "bg-red-100 text-red-700", icon: XCircle },
    { value: "blocked", label: "Blocked", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    { value: "booked", label: "Booked", color: "bg-blue-100 text-blue-700", icon: Clock },
];

export const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-700";
};

export const getStatusIcon = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.icon : CheckCircle;
};

export const getStatusBgColor = (status) => {
    const colors = {
        available: "bg-green-50 border-green-200",
        sold: "bg-red-50 border-red-200",
        blocked: "bg-yellow-50 border-yellow-200",
        booked: "bg-blue-50 border-blue-200"
    };
    return colors[status] || "bg-gray-50 border-gray-200";
};