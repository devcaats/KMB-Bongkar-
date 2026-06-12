import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { EyeCloseIcon, EyeIcon } from "../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button.jsx";

export default function SignUpForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [nameError, setNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirmationError, setPasswordConfirmationError] = useState("");

    const validateEmail = (val) => {
        if (!val) {
            setEmailError("Email wajib diisi");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
            setEmailError("Format email tidak valid (contoh: nama@domain.com)");
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleEmailChange = (e) => {
        const val = e.target.value;
        setData("email", val);

        if (emailError) {
            setEmailError("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let isValid = true;

        if (!data.name) {
            setNameError("Nama wajib diisi");
            isValid = false;
        } else {
            setNameError("");
        }

        const isEmailValid = validateEmail(data.email);
        if (!isEmailValid) {
            isValid = false;
        }

        if (!data.password) {
            setPasswordError("Password wajib diisi");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (data.password !== data.password_confirmation) {
            setPasswordConfirmationError("Konfirmasi password tidak cocok");
            isValid = false;
        } else {
            setPasswordConfirmationError("");
        }

        if (!isValid) {
            return;
        }

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        {/* Tampilan Mobile Only (Logo & Slogan KMB) */}
                        <div className="lg:hidden mb-6 flex flex-col items-center">
                            <Link href="/" className="block mb-3">
                                <img
                                    className="h-10 dark:invert"
                                    src="/images/shape/logo.svg"
                                    alt="Logo KMB"
                                />
                            </Link>
                            <p className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                                We{" "}
                                <span
                                    className="text-brand-500 dark:text-brand-400"
                                    style={{
                                        borderBottom: "2px solid #465fff",
                                        paddingBottom: "1px",
                                    }}
                                >
                                    CARE
                                </span>
                            </p>
                            <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                for Every Load We Carry
                            </p>
                            <div className="w-full border-b border-gray-100 dark:border-gray-800/60 my-4"></div>
                        </div>

                        <h1 className="sm:block hidden mb-2 font-bold text-2xl text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md ">
                            KMB BONGKAR
                        </h1>

                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Daftar Akun Baru
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Silahkan lengkapi data di bawah ini untuk membuat akun.
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div>
                                    <Label>
                                        Nama Lengkap{" "}
                                        <span className="text-error-500">
                                            *
                                        </span>{" "}
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Masukkan nama lengkap Anda"
                                        value={data.name}
                                        onChange={(e) => {
                                            setData("name", e.target.value);
                                            if (nameError) setNameError("");
                                        }}
                                        error={!!nameError || !!errors.name}
                                        hint={nameError || errors.name}
                                    />
                                </div>
                                <div>
                                    <Label>
                                        Email{" "}
                                        <span className="text-error-500">
                                            *
                                        </span>{" "}
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder="info@gmail.com"
                                        value={data.email}
                                        onChange={handleEmailChange}
                                        error={!!emailError || !!errors.email}
                                        hint={emailError || errors.email}
                                    />
                                </div>
                                <div>
                                    <Label>
                                        Password{" "}
                                        <span className="text-error-500">
                                            *
                                        </span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={data.password}
                                            onChange={(e) => {
                                                setData("password", e.target.value);
                                                if (passwordError) setPasswordError("");
                                            }}
                                            error={!!passwordError || !!errors.password}
                                            hint={passwordError || errors.password}
                                        />
                                        <span
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>
                                        Konfirmasi Password{" "}
                                        <span className="text-error-500">
                                            *
                                        </span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPasswordConfirmation
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm your password"
                                            value={data.password_confirmation}
                                            onChange={(e) => {
                                                setData("password_confirmation", e.target.value);
                                                if (passwordConfirmationError) setPasswordConfirmationError("");
                                            }}
                                            error={!!passwordConfirmationError || !!errors.password_confirmation}
                                            hint={passwordConfirmationError || errors.password_confirmation}
                                        />
                                        <span
                                            onClick={() =>
                                                setShowPasswordConfirmation(!showPasswordConfirmation)
                                            }
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPasswordConfirmation ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button
                                        className="w-full"
                                        size="sm"
                                        disabled={processing}
                                    >
                                        {processing ? "Memproses..." : "Daftar"}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Already have an account? {""}
                                <Link
                                    href="/login"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
