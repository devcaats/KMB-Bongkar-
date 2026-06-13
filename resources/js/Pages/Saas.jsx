import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import SaasMetrics from "@/Components/saas/SaasMetrics";
import ChurnRateChart from "@/Components/saas/ChurnRateChart";
import UserGrowthChart from "@/Components/saas/UserGrowthChart";
import ConversionFunnelChart from "@/Components/saas/ConversionFunnelChart";
import RecentInvoices from "@/Components/saas/RecentInvoices";
import ProductPerformance from "@/Components/saas/ProductPerformance";
import RecentActivities from "@/Components/saas/RecentActivities";

export default function Saas() {
    return (
        <AppLayout>
            <Head title="SaaS Dashboard" />

            <div className="space-y-6">
                {/* 4 Cards Overview Metrics */}
                <SaasMetrics />

                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {/* Left side: Churn, Growth, Funnel, Invoices */}
                    <div className="col-span-12 space-y-6 xl:col-span-7 2xl:col-span-8">
                        <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
                            <ChurnRateChart />
                            <UserGrowthChart />
                        </div>
                        <ConversionFunnelChart />
                        <RecentInvoices />
                    </div>

                    {/* Right side: Product Performance, Activities */}
                    <div className="col-span-12 space-y-6 xl:col-span-5 2xl:col-span-4">
                        <ProductPerformance />
                        <RecentActivities />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
