"use client"

import User from '@/components/user';
import React from 'react';
import ProtectedRoute from "@/components/protected-route";

const Page = () => {
    return (
        <ProtectedRoute>
            <User />
        </ProtectedRoute>
    );
};

export default Page;
