import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import EcommerceMetrics from "@/Components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/Components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/Components/ecommerce/StatisticsChart";
import RecentOrders from "@/Components/ecommerce/RecentOrders";
import DemographicCard from "@/Components/ecommerce/DemographicCard";

export default function Dashboard({ metrics }) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Metrics Row */}
                <div className="col-span-12">
                    <EcommerceMetrics metrics={metrics} />
                </div>

                {/* Monthly Sales Chart */}
                <div className="col-span-12">
                    <MonthlySalesChart />
                </div>

                {/* Statistics Chart */}
                <div className="col-span-12">
                    <StatisticsChart />
                </div>

                {/* Demographics */}
                <div className="col-span-12 xl:col-span-5">
                    <DemographicCard />
                </div>

                {/* Recent Orders */}
                <div className="col-span-12 xl:col-span-7">
                    <RecentOrders />
                </div>
            </div>
        </AppLayout>
    );
}
