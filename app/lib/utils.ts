export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: {month: string, revenue: number, user_id: string}[]) => {
  // 只显示最多5个y轴标签，分布均匀，单位为美元整数
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;
  const labelCount = 5;
  for (let i = 0; i < labelCount; i++) {
    const value = Math.round(topLabel - (topLabel / (labelCount - 1)) * i);
    yAxisLabels.push(`$${value}`);
  }
  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

/**
 * 处理原始SQL结果，补全近12个月的月份，转换为英文缩写，金额转为美元
 */
export function getLast12MonthsRevenue(
  rawData: { month: string; revenue: number }[],
  userId: string
): {month: string, revenue: number, user_id: string}[] {
  const now = new Date();
  const months: { key: string; label: string }[] = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    const label = monthNames[d.getMonth()];
    months.push({ key, label });
  }
  const revenueMap = new Map(rawData.map((item) => [item.month, item]));
  return months.map(({ key, label }) => {
    const item = revenueMap.get(key);
    return {
      month: label,
      revenue: item ? Number(item.revenue) / 100 : 0, // 转为美元
      user_id: userId,
    };
  });
}
