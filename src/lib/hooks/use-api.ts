import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { apiService } from '@/lib/api/services';
import { ScanType, BodyRegion } from '@/types';

// Zustand Global UI Store
interface AppUiState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  activeScanId: string | null;
  setActiveScanId: (id: string | null) => void;
}

export const useAppUiStore = create<AppUiState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  searchModalOpen: false,
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  activeScanId: null,
  setActiveScanId: (id) => set({ activeScanId: id }),
}));

// --- TanStack Query Hooks ---
export function useAnalyses() {
  return useQuery({
    queryKey: ['analyses'],
    queryFn: () => apiService.getAnalyses(),
  });
}

export function useAnalysis(id: string) {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () => apiService.getAnalysisById(id),
    enabled: !!id,
  });
}

export function useCreateAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      patientId: string;
      patientAge?: number;
      patientGender?: 'Male' | 'Female' | 'Other';
      scanType: ScanType;
      bodyRegion: BodyRegion;
      imageUrl?: string;
    }) => apiService.createAnalysis(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses'] });
    },
  });
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => apiService.getReports(),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => apiService.getReportById(id),
    enabled: !!id,
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (analysisId: string) => apiService.generateReport(analysisId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useChatMessages() {
  return useQuery({
    queryKey: ['chatMessages'],
    queryFn: () => apiService.getChatMessages(),
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => apiService.sendChatMessage(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });
}

export function useDrugs() {
  return useQuery({
    queryKey: ['drugs'],
    queryFn: () => apiService.getDrugs(),
  });
}

export function useScanDrug() {
  return useMutation({
    mutationFn: (imagePreview: string) => apiService.scanDrugByImage(imagePreview),
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => apiService.getUserProfile(),
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => apiService.getAdminStats(),
  });
}

export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: () => apiService.getModels(),
  });
}
