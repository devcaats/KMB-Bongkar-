import AuthLayout from "@/Components/AuthPages/AuthPageLayout";
import SignUpForm from "@/Components/AuthPages/SignUpForm";
import { Head } from "@inertiajs/react";

export default function Register() {
    return (
        <>
            <Head title="Daftar" />
            <AuthLayout>
                <SignUpForm></SignUpForm>
            </AuthLayout>
        </>
    );
}
