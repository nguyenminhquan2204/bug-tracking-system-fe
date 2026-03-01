export interface ISummaryStatus {
   TOTAL: number,
   TODO: number,
   DOING: number,
   PR_IN_REVIEW: number,
   DONE_IN_DEV: number
}

export interface IStatusChartItem {
   name: string;
   value: number;
   color?: string;
}

export interface ITrend7DayItem {
   date: string,
   created: number,
   resolved: number
}

export interface ITop4ProjectOpenBugItem {
   name: string,
   open: number
}

export interface ITop3UserWithOpenBugsItem {
   id: number,
   name: string,
   open: number
}

export interface IDashboardData {
   summaryStatus: ISummaryStatus,
   fullStatus: IStatusChartItem[],
   trend7Days: ITrend7DayItem[],
   top4ProjectByOpenBug: ITop4ProjectOpenBugItem[],
   top3UserWithOpenBugs: ITop3UserWithOpenBugsItem[]
}