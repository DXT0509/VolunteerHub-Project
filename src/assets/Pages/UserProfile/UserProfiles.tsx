import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

type User = {
    name: string;
    title: string;
    email: string;
    phone: string;
    username: string;
    bio: string;
    avatarUrl: string;
    joinedAt: string; // ISO-like date string
    status: "Active" | "Inactive" | "Pending";
    stats: {
        projects: number;
        followers: number;
        following: number;
    };
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
};

const initialUser: User = {
    name: "Leslie Alexander",
    title: "Product Designer",
    email: "leslie@example.com",
    phone: "+1 (555) 000-0000",
    username: "lesliealex",
    bio:
        "Creative product designer with 8+ years of experience shipping delightful, accessible interfaces.",
    avatarUrl: "https://i.pravatar.cc/160?img=47",
    joinedAt: "2022-07-10",
    status: "Active",
    stats: {
        projects: 18,
        followers: 1240,
        following: 321,
    },
    address: {
        street: "1234 Market St",
        city: "San Francisco",
        state: "CA",
        zip: "94103",
        country: "United States",
    },
};

export default function UserProfileStandalone() {
    const location = useLocation();
    const routeState = (location?.state || null) as
        | {
            username?: string;
            email?: string;
            full_name?: string;
            avatar_url?: string;
            phone?: string;
        }
        | null;

    const defaultUser: User = {
        ...initialUser,
        name: routeState?.full_name ?? initialUser.name,
        email: routeState?.email ?? initialUser.email,
        phone: routeState?.phone ?? initialUser.phone,
        username: routeState?.username ?? initialUser.username,
    };

    const [user, setUser] = useState<User>(defaultUser);
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<Date | null>(null);

    // Page meta (no external libraries)
    useEffect(() => {
        const prevTitle = document.title;
        document.title =
            "React Profile Dashboard | Tailwind Admin UI - Standalone";
        const desc = document.querySelector('meta[name="description"]');
        const restoreContent = desc?.getAttribute("content") || "";
        if (desc) {
            desc.setAttribute(
                "content",
                "Standalone user profile page built with React and Tailwind CSS."
            );
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content =
                "Standalone user profile page built with React and Tailwind CSS.";
            document.head.appendChild(meta);
        }
        return () => {
            document.title = prevTitle;
            if (desc) desc.setAttribute("content", restoreContent);
        };
    }, []);

    const onSave = async (nextUser: User) => {
        setSaving(true);
        // Simulate API
        await new Promise((r) => setTimeout(r, 800));
        setUser(nextUser);
        setSaving(false);
        setSavedAt(new Date());
    };

    return (
        <div className="min-h-dvh bg-gray-50 p-4 text-gray-900 antialiased dark:bg-gray-950 dark:text-white">
            <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
                <Breadcrumb pageTitle="Profile" />

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                    <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                        Profile
                    </h3>

                    <div className="space-y-6">
                        <UserMetaCard
                            user={user}
                        />

                        <UserInfoCard
                            user={user}
                            saving={saving}
                            savedAt={savedAt}
                            onSave={onSave}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------------------------- UI ---------------------------------- */

function Breadcrumb({ pageTitle }: { pageTitle: string }) {
    return (
        <div className="flex items-center justify-between">
            <nav
                aria-label="Breadcrumb"
                className="text-sm text-gray-500 dark:text-gray-400"
            >
                <ol className="flex items-center space-x-2">
                    <li>
                        <span className="hover:text-gray-700 dark:hover:text-gray-200">
                            Home
                        </span>
                    </li>
                    <li className="select-none">/</li>
                    <li className="font-medium text-gray-800 dark:text-gray-200">
                        {pageTitle}
                    </li>
                </ol>
            </nav>
        </div>
    );
}

function UserMetaCard({ user }: { user: User }) {
    const joined = useMemo(() => {
        try {
            return new Date(user.joinedAt).toLocaleDateString();
        } catch {
            return user.joinedAt;
        }
    }, [user.joinedAt]);

    return (
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02] sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                    <img
                        src={user.avatarUrl}
                        alt={`${user.name} avatar`}
                        className="h-20 w-20 rounded-full border border-gray-200 object-cover dark:border-gray-800"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.name}
                            </h4>
                            <StatusBadge status={user.status} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Joined {joined}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatusBadge({ status }: { status: User["status"] }) {
    const colors =
        status === "Active"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-700/40"
            : status === "Pending"
                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-700/40"
                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-700/40";
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${colors}`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${status === "Active"
                    ? "bg-emerald-500"
                    : status === "Pending"
                        ? "bg-amber-500"
                        : "bg-gray-400"
                    }`}
            />
            {status}
        </span>
    );
}

// (removed unused Stat helper)


function UserInfoCard({
    user,
    saving,
    savedAt,
    onSave,
}: {
    user: User;
    saving: boolean;
    savedAt: Date | null;
    onSave: (next: User) => void | Promise<void>;
}) {
    const [form, setForm] = useState(() => ({
        name: user.name,
        title: user.title,
        email: user.email,
        phone: user.phone,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
    }));
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setForm({
            name: user.name,
            title: user.title,
            email: user.email,
            phone: user.phone,
            username: user.username,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
        });
    }, [user]);

    const handleChange =
        (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAvatarFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setForm((f) => ({ ...f, avatarUrl: url }));
        }
    };

    // Revoke object URL when avatarFile changes or on unmount
    useEffect(() => {
        return () => {
            if (form.avatarUrl && form.avatarUrl.startsWith("blob:")) {
                try {
                    URL.revokeObjectURL(form.avatarUrl);
                } catch { }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [avatarFile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Simple validation
        if (!form.name.trim()) return setError("Name is required.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            return setError("Invalid email address.");
        // No website validation

        await onSave({ ...user, ...form });
    };

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02] sm:p-5">
            <h4 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                Personal Information
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        label="Full name"
                        value={form.name}
                        onChange={handleChange("name")}
                        placeholder="Enter full name"
                        layout="horizontal"
                        required
                    />
                    <TextField
                        label="Title"
                        value={form.title}
                        onChange={handleChange("title")}
                        placeholder="e.g. Product Designer"
                        layout="horizontal"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        placeholder="name@example.com"
                        required
                        layout="horizontal"
                    />
                    <TextField
                        label="Phone"
                        value={form.phone}
                        onChange={handleChange("phone")}
                        placeholder="+1 (555) 000-0000"
                        layout="horizontal"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        label="Username"
                        value={form.username}
                        onChange={handleChange("username")}
                        placeholder="yourusername"
                        layout="horizontal"
                    />
                    <TextField
                        label="Avatar URL"
                        value={form.avatarUrl}
                        onChange={handleChange("avatarUrl")}
                        placeholder="https://..."
                        layout="horizontal"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">

                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Avatar Image
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarFileChange}
                            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-transparent dark:text-white dark:focus:border-gray-500 dark:focus:ring-white/10"
                        />
                    </label>
                    <div className="w-30 h-30 flex items-center justify-center rounded-full overflow-hidden ">
                        <PreviewAvatar url={form.avatarUrl} name={form.name} />
                    </div>

                </div>

                <TextArea
                    label="Bio"
                    value={form.bio}
                    onChange={handleChange("bio")}
                    placeholder="Short introduction..."
                    rows={4}
                />

                {error && (
                    <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
                )}
                {savedAt && !saving && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Saved at {savedAt.toLocaleTimeString()}
                    </p>
                )}

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-white"
                    >
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                    <button
                        type="button"
                        className="text-sm text-gray-600 underline-offset-2 hover:underline dark:text-gray-300"
                        onClick={() =>
                            setForm({
                                name: user.name,
                                title: user.title,
                                email: user.email,
                                phone: user.phone,
                                username: user.username,
                                bio: user.bio,
                                avatarUrl: user.avatarUrl,
                            })
                        }
                    >
                        Reset
                    </button>
                    {/* Clear selected file on reset */}
                    {avatarFile && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Local image selection cleared</span>
                    )}
                </div>
            </form>
        </section>
    );
}


/* -------------------------------- Fields -------------------------------- */

function TextField({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    required,
    layout = "vertical",
}: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    layout?: "vertical" | "horizontal";
}) {
    if (layout === "horizontal") {
        return (
            <div className="flex items-center gap-4">
                <span className="min-w-28 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-rose-500">*</span>}
                </span>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-white/10"
                />
            </div>
        );
    }
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-rose-500">*</span>}
            </span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-white/10"
            />
        </label>
    );
}

function TextArea({
    label,
    value,
    onChange,
    placeholder,
    rows = 3,
}: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </span>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="block w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:focus:ring-white/10"
            />
        </label>
    );
}

function PreviewAvatar({ url, name }: { url: string; name: string }) {
    return (
        <div className="flex items-end gap-3">
            <div>
                <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preview
                </span>
                <img
                    src={url || "https://via.placeholder.com/80?text=Avatar"}
                    alt={`${name} avatar preview`}
                    className="h-16 w-16 rounded-full border border-gray-200 object-cover dark:border-gray-800"
                />
            </div>
        </div>
    );
}

/* ------------------------------- Utilities ------------------------------ */

// (removed unused utility)