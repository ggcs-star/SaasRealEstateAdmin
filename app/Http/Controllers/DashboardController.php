<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Project;
use App\Models\Customer;
use App\Models\User;
use App\Models\Collection;
use App\Models\Commission;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use MongoDB\BSON\UTCDateTime;
class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Date filters for charts and stats
        $currentMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $currentYear = Carbon::now()->startOfYear();

        // 1 & 6: Base queries completely shifted to Role-Based Visibility
        $projectsQuery = Project::visibleTo($user);
        $customersQuery = Customer::visibleTo($user);
        $bookingsQuery = Booking::visibleTo($user);
        $collectionsQuery = Collection::visibleTo($user);
        $commissionsQuery = Commission::visibleTo($user);

        // 2: Main Statistics (Strictly using cloned queries to prevent mutation)
        $stats = [
            'totalProjects' => (clone $projectsQuery)->count(),
            'activeProjects' => (clone $projectsQuery)->where('status', 'active')->count(),
            'totalCustomers' => (clone $customersQuery)->count(),
            'totalBookings' => (clone $bookingsQuery)->count(),
            'totalUsers' => $user->isSuperAdmin() 
                ? User::count() 
                : User::whereIn('_id', $user->accessibleUserIds())->count(),
            
            // Revenue Stats
            'totalRevenue' => (clone $collectionsQuery)
                ->where('type', 'Actual_Payment')
                ->sum('paid_amount'),
            
            'currentMonthRevenue' => (clone $collectionsQuery)
                ->where('type', 'Actual_Payment')
                ->where('payment_date', '>=', $currentMonth->toDateTimeString())
                ->sum('paid_amount'),
            
            'totalDueAmount' => (clone $bookingsQuery)->sum('due_amount'),
            
            // Booking Stats
            'currentMonthBookings' => (clone $bookingsQuery)
                ->where('booking_date', '>=', $currentMonth->toDateTimeString())
                ->count(),
            
            'lastMonthBookings' => (clone $bookingsQuery)
                ->whereBetween('booking_date', [
                    $lastMonth->toDateTimeString(), 
                    $currentMonth->toDateTimeString()
                ])
                ->count(),
            
            'totalUnitsBooked' => (clone $bookingsQuery)
                ->whereNotIn('status', ['Cancelled', 'Refunded'])
                ->count(),
            
            // Commission Stats
            'totalCommission' => (clone $commissionsQuery)->sum('commission_amount'),
            
            'pendingCommission' => (clone $commissionsQuery)
                ->where('commission_status', 'Pending')
                ->sum('commission_amount'),
        ];

        // 3: MongoDB Safe Status Distribution (No selectRaw)
        $bookingStatusDistribution = [
            'Enquiry' => (clone $bookingsQuery)->where('status', 'Enquiry')->count(),
            'Hold' => (clone $bookingsQuery)->where('status', 'Hold')->count(),
            'Booked' => (clone $bookingsQuery)->where('status', 'Booked')->count(),
            'Agreement Done' => (clone $bookingsQuery)->where('status', 'Agreement Done')->count(),
            'Registered' => (clone $bookingsQuery)->where('status', 'Registered')->count(),
            'Completed' => (clone $bookingsQuery)->where('status', 'Completed')->count(),
            'Cancelled' => (clone $bookingsQuery)->where('status', 'Cancelled')->count(),
            'Refunded' => (clone $bookingsQuery)->where('status', 'Refunded')->count(),
        ];

        // Filter out zero values for cleaner UI
        $bookingStatusDistribution = array_filter($bookingStatusDistribution, fn($val) => $val > 0);

        // Monthly Revenue Chart Data (Last 6 months)
        $monthlyRevenue = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            
            $monthlyRevenue[] = [
                'month' => $monthStart->format('M Y'),
                'revenue' => (clone $collectionsQuery)
                    ->where('type', 'Actual_Payment')
                    ->whereBetween('payment_date', [
                        $monthStart->toDateTimeString(),
                        $monthEnd->toDateTimeString()
                    ])
                    ->sum('paid_amount'),
                'bookings' => (clone $bookingsQuery)
                    ->whereBetween('booking_date', [
                        $monthStart->toDateTimeString(),
                        $monthEnd->toDateTimeString()
                    ])
                    ->count(),
            ];
        }

        // Project-wise Booking Distribution (Safe MongoDB Grouping without selectRaw)
        $projectWiseBookings = (clone $bookingsQuery)
            ->with('project')
            ->get()
            ->groupBy('project_id')
            ->map(function ($group) {
                $first = $group->first();
                return [
                    'project_name' => $first->project->name ?? 'N/A',
                    'project_type' => $first->project->project_type ?? 'N/A',
                    'total_bookings' => $group->count(),
                    'total_value' => $group->sum('total_amount'),
                ];
            })->values();

        // 4: Removed partial select fields from 'with()' for MongoDB safety
        $recentBookings = (clone $bookingsQuery)
            ->with(['customer', 'project'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => (string) $booking->_id,
                    'booking_number' => $booking->booking_number,
                    'customer_name' => ($booking->customer->first_name ?? '') . ' ' . ($booking->customer->last_name ?? 'N/A'),
                    'project_name' => $booking->project->name ?? 'N/A',
                    'total_amount' => $booking->total_amount,
                    'booking_date' => $booking->booking_date,
                    'status' => $booking->status,
                    'payment_status' => $booking->payment_status,
                ];
            });

        $recentCollections = (clone $collectionsQuery)
            ->where('type', 'Actual_Payment')
            ->with(['booking', 'customer', 'project'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($collection) {
                return [
                    'receipt_number' => $collection->receipt_number,
                    'booking_number' => $collection->booking->booking_number ?? 'N/A',
                    'customer_name' => ($collection->customer->first_name ?? '') . ' ' . ($collection->customer->last_name ?? 'N/A'),
                    'project_name' => $collection->project->name ?? 'N/A',
                    'paid_amount' => $collection->paid_amount,
                    'payment_date' => $collection->payment_date,
                    'payment_mode' => $collection->payment_mode,
                ];
            });

        $recentProjects = (clone $projectsQuery)
            ->with(['builder', 'city', 'area'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($project) {
                return [
                    'id' => (string) $project->_id,
                    'name' => $project->name,
                    'project_type' => $project->project_type,
                    'builder_name' => $project->builder->name ?? 'N/A',
                    'location' => ($project->city->name ?? '') . 
                                  ($project->area->name ? ', ' . $project->area->name : ''),
                    'status' => $project->status,
                    'is_featured' => $project->is_featured,
                    'cover_image_url' => $project->cover_image_url,
                ];
            });

        // 7: Upcoming Payments (Fixed Date Range Query)
        $upcomingPayments = (clone $collectionsQuery)
            ->where('type', 'Scheduled')
            ->where('status', 'Pending')
            ->whereBetween('scheduled_date', [
                Carbon::now()->toDateTimeString(),
                Carbon::now()->endOfMonth()->toDateTimeString()
            ])
            ->with(['booking', 'customer'])
            ->orderBy('scheduled_date')
            ->take(10)
            ->get()
            ->map(function ($payment) {
                return [
                    'booking_number' => $payment->booking->booking_number ?? 'N/A',
                    'customer_name' => ($payment->customer->first_name ?? '') . ' ' . ($payment->customer->last_name ?? 'N/A'),
                    'customer_phone' => $payment->customer->phone ?? 'N/A',
                    'scheduled_amount' => $payment->scheduled_amount,
                    'scheduled_date' => $payment->scheduled_date,
                    'installment_name' => $payment->installment_name,
                ];
            });

        // Overdue Payments
        $overduePayments = (clone $collectionsQuery)
            ->where('type', 'Scheduled')
            ->where('status', 'Pending')
            ->where('scheduled_date', '<', Carbon::now()->toDateTimeString())
            ->with(['booking', 'customer'])
            ->orderBy('scheduled_date')
            ->take(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'booking_number' => $payment->booking->booking_number ?? 'N/A',
                    'customer_name' => ($payment->customer->first_name ?? '') . ' ' . ($payment->customer->last_name ?? 'N/A'),
                    'customer_phone' => $payment->customer->phone ?? 'N/A',
                    'scheduled_amount' => $payment->scheduled_amount,
                    'scheduled_date' => $payment->scheduled_date,
                    'days_overdue' => Carbon::parse($payment->scheduled_date)->diffInDays(Carbon::now()),
                    'installment_name' => $payment->installment_name,
                ];
            });

        // Commission Pending Approvals
        $pendingCommissionsList = (clone $commissionsQuery)
            ->where('commission_status', 'Pending')
            ->with(['booking', 'booking.channelPartner'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($commission) {
                return [
                    'booking_number' => $commission->booking->booking_number ?? 'N/A',
                    'channel_partner' => $commission->booking->channelPartner->partner_name ?? 'N/A',
                    'commission_amount' => $commission->commission_amount,
                    'commission_type' => $commission->commission_type,
                ];
            });

        // 8: User Performance (Fixed builder reuse issue inside loop)
        $userPerformance = [];
        if ($user->isSuperAdmin() || $user->isManager()) {
            $userPerformance = User::whereIn('_id', $user->isSuperAdmin() 
                    ? User::pluck('_id')->toArray() 
                    : $user->accessibleUserIds()
                )
                ->where('role', 'employee')
                ->get()
                ->map(function ($employee) use ($bookingsQuery, $collectionsQuery, $currentMonth) {
                    
                    // Cloned queries for specific employee
                    $employeeBookings = (clone $bookingsQuery)->where('created_by_id', (string) $employee->_id);
                    $employeeBookingIds = $employeeBookings->pluck('_id')->toArray();
                    
                    return [
                        'id' => (string) $employee->_id,
                        'name' => $employee->name,
                        'role' => $employee->role,
                        'total_bookings' => $employeeBookings->count(),
                        'total_revenue' => empty($employeeBookingIds) ? 0 : (clone $collectionsQuery)
                            ->where('type', 'Actual_Payment')
                            ->whereIn('booking_id', $employeeBookingIds)
                            ->sum('paid_amount'),
                        'month_bookings' => (clone $employeeBookings)
                            ->where('booking_date', '>=', $currentMonth->toDateTimeString())
                            ->count(),
                    ];
                })
                ->sortByDesc('total_bookings')
                ->values();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'bookingStatusDistribution' => $bookingStatusDistribution,
            'monthlyRevenue' => $monthlyRevenue,
            'projectWiseBookings' => $projectWiseBookings,
            'recentBookings' => $recentBookings,
            'recentCollections' => $recentCollections,
            'recentProjects' => $recentProjects,
            'upcomingPayments' => $upcomingPayments,
            'overduePayments' => $overduePayments,
            'pendingCommissions' => $pendingCommissionsList,
            'userPerformance' => $userPerformance,
            'currentRole' => $user->role,
            'userName' => $user->name,
            'currentDate' => Carbon::now()->format('d M, Y'),
            'filters' => [
                'selectedPeriod' => $request->get('period', 'monthly'),
                'selectedYear' => $request->get('year', Carbon::now()->year),
            ]
        ]);
    }

    /**
     * API endpoint for dynamic chart data (AJAX)
     */
    public function getChartData(Request $request)
    {
        $user = auth()->user();
        $period = $request->get('period', 'monthly');
        $year = $request->get('year', Carbon::now()->year);
        
        $bookingsQuery = Booking::visibleTo($user);
        
        $data = [];
        
        if ($period === 'yearly') {
            for ($month = 1; $month <= 12; $month++) {
                $startDate = Carbon::create($year, $month, 1)->startOfMonth();
                $endDate = Carbon::create($year, $month, 1)->endOfMonth();
                
                $data[] = [
                    'label' => $startDate->format('M'),
                    'bookings' => (clone $bookingsQuery)
                        ->whereBetween('booking_date', [
                            $startDate->toDateTimeString(),
                            $endDate->toDateTimeString()
                        ])
                        ->count(),
                ];
            }
        }
        
        return response()->json(['data' => $data]);
    }
}