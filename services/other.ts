import axios from 'axios';
import { toast } from 'react-toastify';
import type { other_page as OtherPageT } from '@prisma/client';

export const deleteOtherPage = async (id: number) => {
  const response = await axios.delete<OtherPageT>('/api/other', {
    data: id,
  });

  if (response.status === 200) {
    toast.success('Page deleted successfully');
    return { isOk: true };
  } else {
    toast.error('Something went wrong!');
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const updateOtherPage = async (data: OtherPageT) => {
  const response = await axios.put<OtherPageT>('/api/other', { data });

  if (response.status === 200) {
    toast.success('Page updated successfully');
    return { isOk: true, data: response.data };
  } else {
    toast.error('Something went wrong!');
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const updateOrderOtherPages = async (data: OtherPageT[]) => {
  const response = await axios.put<OtherPageT[]>('/api/other/order', { data });

  if (response.status === 200) {
    toast.success('Page order changed successfully');
    return { isOk: true, data: response.data };
  } else {
    toast.error('Something went wrong!');
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const createOtherPage = async (
  data: Omit<OtherPageT, 'id'>
): Promise<{
  isOk: boolean;
  errorMessage?: string;
  data?: Omit<OtherPageT, 'id'>;
}> => {
  const response = await axios.post<Omit<OtherPageT, 'id'>>('/api/other/new', {
    data,
  });

  if (response.status === 200) {
    toast.success('Page created successfully');
    return { isOk: true, data: response.data };
  } else {
    toast.error('Something went wrong!');
    return { isOk: false, errorMessage: response.statusText };
  }
};
