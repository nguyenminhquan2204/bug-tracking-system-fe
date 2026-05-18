import { DEFAULT_GET_LIST_QUERY } from "@/packages/utils";
import { IExpense, IExpenseGetListQuery } from "../interface";
import { create } from "zustand";
import { manageExpenseService } from "../services/manage-expense.service";

interface States {
  isOpenCreateExpenseDialog: boolean;
  isOpenEditExpenseDialog: boolean;
  isOpenDeleteExpenseDialog: boolean;

  loading: boolean;

  expenseGetListQuery: IExpenseGetListQuery;
  totalItems: number;
  totalAmount: number;
  totalTransactions: number;

  latestTransaction: IExpense | null;
  projectId: number | null;

  expenseList: IExpense[];

  selectedExpense: IExpense | null;
}

interface Actions {
  setisOpenCreateExpenseDialog: (open: boolean) => void;
  setIsOpenEditExpenseDialog: (open: boolean) => void;
  setIsOpenDeleteExpenseDialog: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setTotalItems: (totalItems: number) => void;
  setExpenseGetListQuery: (
    query: Partial<IExpenseGetListQuery>,
    opt?: { reloadList?: boolean },
  ) => void;
  setExpenseList: (expenseList: IExpense[]) => void;
  setSelectedExpense: (expense: IExpense | null) => void;
  setProjectId: (projectId: number) => void;

  getExpenseList: (projectId?: number) => Promise<void>;
  getExpenseSummary: (projectId: number) => Promise<void>;

  resetState: () => void;
}

const initialState: States = {
  isOpenCreateExpenseDialog: false,
  isOpenEditExpenseDialog: false,
  isOpenDeleteExpenseDialog: false,
  loading: false,
  expenseGetListQuery: { ...DEFAULT_GET_LIST_QUERY },
  totalItems: 0,
  totalAmount: 0,
  totalTransactions: 0,
  latestTransaction: null,
  expenseList: [],
  selectedExpense: null,
  projectId: null,
};

export const useManageExpenseStore = create<States & Actions>((set, get) => ({
  ...initialState,

  setisOpenCreateExpenseDialog: (open) =>
    set({ isOpenCreateExpenseDialog: open }),

  setIsOpenEditExpenseDialog: (open) => set({ isOpenEditExpenseDialog: open }),

  setIsOpenDeleteExpenseDialog: (open) =>
    set({ isOpenDeleteExpenseDialog: open }),

  setLoading: (loading) => set({ loading }),

  setTotalItems: (totalItems) => set({ totalItems }),

  setExpenseGetListQuery: (query, opt) => {
    set((state) => ({
      expenseGetListQuery: {
        ...state.expenseGetListQuery,
        ...query,
      },
    }));

    const { reloadList = true } = opt ?? {};

    if (reloadList) {
      get().getExpenseList();
    }
  },

  setExpenseList: (expenseList) => set({ expenseList }),

  setSelectedExpense: (expense) => set({ selectedExpense: expense }),

  setProjectId: (projectId) => set({ projectId }),

  getExpenseList: async (projectId?: number) => {
    try {
      set({ loading: true });

      const currentProjectId = projectId ?? get().projectId;

      if (!currentProjectId) return;

      const response = await manageExpenseService.getExpenseList(
        currentProjectId,
        get().expenseGetListQuery,
      );

      set({
        projectId: currentProjectId,
        expenseList: response?.data?.items ?? [],
        totalItems: response?.data?.totalItems ?? 0,
      });
    } catch (error) {
      console.error("Get expense list error:", error);
    } finally {
      set({ loading: false });
    }
  },

  getExpenseSummary: async (projectId: number) => {
    try {
      set({ loading: true });
      const response = await manageExpenseService.getExpenseSummary(projectId);
      set({
        totalAmount: response?.data?.totalAmount ?? 0,
        totalTransactions: response?.data?.totalItems ?? 0,
        latestTransaction: response?.data?.latestExpense ?? null,
      });
    } catch (error) {
      console.error("Get expense summary error:", error);
    } finally {
      set({ loading: false });
    }
  },

  // createExpense: async (data) => {
  //   try {
  //     set({ loading: true });
  //     // TODO: Implement API call
  //     // await manageExpenseService.createExpense(data)
  //     get().getExpenseList();
  //     set({ isOpenCreateExpenseDialog: false });
  //   } catch (error) {
  //     console.error("Create expense error:", error);
  //   } finally {
  //     set({ loading: false });
  //   }
  // }

  resetState: () => set({ ...initialState }),
}));
