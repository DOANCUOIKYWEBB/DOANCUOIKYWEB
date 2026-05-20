"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfileAction } from "../actions/profileActions";
import ExportPdfButton from "../components/ExportPdfButton";
import { useAuthStore } from "../store/useAuthStore";
import type { AuthUser, PortfolioDetail, PortfolioPdfProfile } from "../types/api";
import { profileActionSchema, type ProfileActionValues } from "../utils/validationSchemas";

type DashboardClientProps = {
  user: AuthUser;
  myPortfolios: PortfolioDetail[];
};

const categoryLabels: Record<string, string> = {
  design: "Design",
  art: "Art",
  photo: "Photo",
  "3d": "3D",
  other: "Other",
};

export default function DashboardClient({ user, myPortfolios }: DashboardClientProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "portfolios" | "export">("profile");
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileActionValues>({
    resolver: zodResolver(profileActionSchema),
    defaultValues: {
      userId: user.id,
      name: user.name,
      skills: "",
      experience: "",
      socialLinks: "",
    },
  });

  const onSubmit = async (values: ProfileActionValues) => {
    setIsSubmitting(true);
    setSubmitResult(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => formData.append(key, val ?? ""));
    const result = await updateProfileAction(formData);
    setSubmitResult(result);
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const pdfProfile: PortfolioPdfProfile = {
    name: user.name,
    email: user.email,
    title: user.role === "admin" ? "Admin · Artfolio" : "Creative Portfolio",
    skills: [],
    experience: [],
    socialLinks: [],
    works: myPortfolios.map((p) => ({
      title: p.title,
      category: p.category,
      description: p.description,
    })),
  };

  const tabs = [
    { key: "profile" as const, label: "Hồ sơ" },
    { key: "portfolios" as const, label: `Tác phẩm (${myPortfolios.length})` },
    { key: "export" as const, label: "Xuất PDF" },
  ];

  return (
    <section className="py-8 sm:py-10">
      <div className="app-container">
        <div className="mb-6 flex items-end justify-between border-b border-border pb-6">
          <div>
            <p className="mb-2 text-sm font-bold uppercase text-primary">Dashboard</p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Không gian cá nhân</h1>
          </div>
          <button
            type="button"
            className="btn btn-secondary text-sm"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="grid h-fit gap-4">
            {/* User card */}
            <div className="surface grid gap-4 rounded-lg p-5">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={72}
                  height={72}
                  className="rounded-full"
                />
              ) : (
                <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-primary text-2xl font-bold text-white">
                  {user.name.slice(0, 1)}
                </div>
              )}
              <div>
                <p className="font-bold">{user.name}</p>
                <p className="text-sm text-muted">{user.email}</p>
                {user.role === "admin" && (
                  <span className="badge mt-2">Admin</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg border border-border bg-surface-soft p-3">
                  <strong className="block text-xl">{myPortfolios.length}</strong>
                  <span className="text-xs text-muted">tác phẩm</span>
                </div>
                <div className="rounded-lg border border-border bg-surface-soft p-3">
                  <strong className="block text-xl">
                    {myPortfolios.reduce((s, p) => s + p.likesCount, 0)}
                  </strong>
                  <span className="text-xs text-muted">lượt thích</span>
                </div>
              </div>
            </div>

            {/* Nav tabs */}
            <nav className="surface overflow-hidden rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`block w-full px-4 py-3 text-left text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-surface-soft hover:text-foreground"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main panel */}
          <div>
            {/* Tab: Hồ sơ */}
            {activeTab === "profile" && (
              <div className="surface rounded-lg p-5 sm:p-7">
                <h2 className="mb-5 text-xl font-bold">Chỉnh sửa hồ sơ</h2>

                {submitResult && (
                  <div
                    className={`mb-5 rounded-lg border p-3 text-sm font-semibold ${
                      submitResult.ok
                        ? "border-border bg-surface-soft text-foreground"
                        : "border-danger bg-surface text-danger"
                    }`}
                  >
                    {submitResult.message}
                  </div>
                )}

                <form className="grid gap-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" {...register("userId")} />

                  <label className="field">
                    <span className="label">Họ tên</span>
                    <input
                      className={`input${errors.name ? " input-error" : ""}`}
                      placeholder="Nguyen Van A"
                      {...register("name")}
                    />
                    {errors.name && <span className="error-text">{errors.name.message}</span>}
                  </label>

                  <label className="field">
                    <span className="label">Email</span>
                    <input
                      className="input cursor-not-allowed opacity-60"
                      value={user.email}
                      disabled
                      title="Email không thể thay đổi"
                    />
                    <span className="text-xs text-muted">Email không thể thay đổi.</span>
                  </label>

                  <label className="field">
                    <span className="label">Kỹ năng</span>
                    <input
                      className={`input${errors.skills ? " input-error" : ""}`}
                      placeholder="Figma, Branding, UI/UX (cách nhau bằng dấu phẩy)"
                      {...register("skills")}
                    />
                    {errors.skills && <span className="error-text">{errors.skills.message}</span>}
                    <span className="text-xs text-muted">Nhập các kỹ năng cách nhau bằng dấu phẩy.</span>
                  </label>

                  <label className="field">
                    <span className="label">Kinh nghiệm</span>
                    <textarea
                      rows={4}
                      className={`input h-auto py-2.5 leading-relaxed${errors.experience ? " input-error" : ""}`}
                      placeholder="Mô tả ngắn kinh nghiệm làm việc..."
                      {...register("experience")}
                    />
                    {errors.experience && (
                      <span className="error-text">{errors.experience.message}</span>
                    )}
                  </label>

                  <label className="field">
                    <span className="label">Social Links</span>
                    <input
                      className="input"
                      placeholder="https://github.com/..., https://dribbble.com/..."
                      {...register("socialLinks")}
                    />
                    <span className="text-xs text-muted">Nhập các link cách nhau bằng dấu phẩy.</span>
                  </label>

                  <div className="flex gap-3">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button type="reset" className="btn btn-secondary">
                      Đặt lại
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab: Tác phẩm */}
            {activeTab === "portfolios" && (
              <div className="grid gap-4">
                <div className="surface flex items-center justify-between rounded-lg p-4">
                  <h2 className="font-bold">Tác phẩm của tôi</h2>
                  <Link href="/portfolios" className="btn btn-secondary text-sm">
                    Khám phá thêm
                  </Link>
                </div>

                {myPortfolios.length === 0 ? (
                  <div className="surface rounded-lg p-10 text-center">
                    <p className="text-lg font-bold">Chưa có tác phẩm nào</p>
                    <p className="mt-2 text-sm text-muted">
                      Tài khoản mới chưa có portfolio. Liên hệ admin để thêm.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {myPortfolios.map((portfolio) => (
                      <Link
                        key={portfolio._id}
                        href={`/portfolio/${portfolio._id}`}
                        className="surface group flex gap-4 rounded-lg p-4 transition hover:-translate-y-0.5"
                      >
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-surface-soft">
                          <Image
                            src={portfolio.images[0]}
                            alt={portfolio.title}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-bold group-hover:text-primary">
                            {portfolio.title}
                          </h3>
                          <span className="badge mt-1">
                            {categoryLabels[portfolio.category] ?? portfolio.category}
                          </span>
                          <p className="mt-2 text-sm text-muted">
                            ❤ {portfolio.likesCount.toLocaleString("vi-VN")} ·{" "}
                            👁 {portfolio.views.toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Xuất PDF */}
            {activeTab === "export" && (
              <div className="surface rounded-lg p-5 sm:p-7">
                <h2 className="mb-2 text-xl font-bold">Xuất Portfolio ra PDF</h2>
                <p className="mb-6 text-sm text-muted">
                  File PDF sẽ bao gồm thông tin hồ sơ và danh sách tác phẩm của bạn.
                </p>

                {/* Preview */}
                <div className="mb-6 grid gap-3 rounded-lg border border-border bg-surface-soft p-5 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase text-muted">Tên</p>
                    <p className="font-semibold">{pdfProfile.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-muted">Email</p>
                    <p>{pdfProfile.email}</p>
                  </div>
                  {pdfProfile.works.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase text-muted">
                        Tác phẩm ({pdfProfile.works.length})
                      </p>
                      <ul className="mt-1 grid gap-0.5">
                        {pdfProfile.works.map((w) => (
                          <li key={w.title} className="text-muted">
                            · {w.title} —{" "}
                            <span className="capitalize">
                              {categoryLabels[w.category] ?? w.category}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pdfProfile.works.length === 0 && (
                    <p className="text-muted">Chưa có tác phẩm nào trong hồ sơ.</p>
                  )}
                </div>

                <ExportPdfButton profile={pdfProfile} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
