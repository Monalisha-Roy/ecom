"use client";
import React from "react";
import AddProduct from "@/components/admin/addProducts";
import DeleteAndEditProducts from "@/components/admin/deleteAndEdit";

export default function AdminDashboard() {
    return (
        <div className="w-full min-h-screen mt-8 p-6 bg-white rounded-lg shadow-md">
            <AddProduct/>
            <DeleteAndEditProducts/>
        </div>
    );
}
