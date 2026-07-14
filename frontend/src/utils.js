export const FILTER_CONFIGS = () => [
    {
        key: 'category',
        label: 'Category',
        allLabel: 'All Categories',
        options: [
            { value: 'Electronics', label: 'Electronics' },
            { value: 'Clothing', label: 'Clothing' },
            { value: 'Home & Garden', label: 'Home & Garden' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Toys', label: 'Toys' }
        ]
    },
    {
        key: 'status',
        label: 'Status',
        allLabel: 'All Statuses',
        options: [
            { value: 'Active', label: 'Active' },
            { value: 'Paused', label: 'Paused' },
            { value: 'Archived', label: 'Archived' }
        ]
    },
    {
        key: 'device_type',
        label: 'Device Type',
        allLabel: 'All Devices',
        options: [
            { value: 'Desktop', label: 'Desktop' },
            { value: 'Mobile', label: 'Mobile' },
            { value: 'Tablet', label: 'Tablet' }
        ]
    },
    {
        key: 'source_type',
        label: 'Source Type',
        allLabel: 'All Sources',
        options: [
            { value: 'Organic', label: 'Organic' },
            { value: 'Paid', label: 'Paid' },
            { value: 'Direct', label: 'Direct' },
            { value: 'Referral', label: 'Referral' }
        ]
    },
    {
        key: 'rank_range',
        label: 'Rank Range',
        allLabel: 'All Ranks',
        options: [
            { value: 'top10', label: 'Top 10' },
            { value: '11-50', label: '11 - 50' },
            { value: '51-100', label: '51 - 100' }
        ]
    }
];

export const METRIC_CONFIG = {
    search_volume: { label: 'Search Volume', chipColor: 'primary', chartColor: '#3b82f6', dataKey: 'search_volume' },
    clicks: { label: 'Clicks', chipColor: 'success', chartColor: '#10b981', dataKey: 'total_clicks' },
    average_ctr: { label: 'Avg CTR', chipColor: 'secondary', chartColor: '#8b5cf6', dataKey: 'average_ctr' },
    average_rank: { label: 'Avg Rank', chipColor: 'warning', chartColor: '#f59e0b', dataKey: 'average_rank' },
};

export const baseColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date', sorter: true },
    { title: 'Keyword', dataIndex: 'keyword', key: 'keyword', sorter: true },
    { title: 'Category', dataIndex: 'category', key: 'category', sorter: true },
    { title: 'Status', dataIndex: 'status', key: 'status', sorter: true },
    { title: 'Device Type', dataIndex: 'device_type', key: 'device_type', sorter: true },
    { title: 'Source Type', dataIndex: 'source_type', key: 'source_type', sorter: true },
    { title: 'Search Volume', dataIndex: 'search_volume', key: 'search_volume', sorter: true },
    { title: 'Clicks', dataIndex: 'clicks', key: 'clicks', sorter: true },
    {
        title: 'CTR (%)',
        dataIndex: 'ctr',
        key: 'ctr',
        sorter: true,
        render: (text) => `${text}%`
    },
    { title: 'Rank', dataIndex: 'rank', key: 'rank', sorter: true },
];

export const formatNumber = (num, decimals = 0) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return Number(num).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};