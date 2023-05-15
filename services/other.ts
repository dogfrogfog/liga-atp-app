import axios from 'axios';
import type { other_page as OtherPageT } from '@prisma/client';

export const deleteOtherPage = async (id: number) => {
  const response = await axios.delete<OtherPageT>('/api/other', {
    data: id,
  });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const updateOtherPage = async (data: OtherPageT) => {
  console.log(data);
  
  console.log('in update');
  
  const response = await axios.put<OtherPageT>('/api/other', { data });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    console.log('in error');
    console.log(response);
    
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const updateOrderOtherPages = async (data: OtherPageT[]) => {
  console.log(`data`, data);
  
  console.log('in update');
  
  const response = await axios.put<OtherPageT[]>('/api/other/all', { data });

  console.log(response);
  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    console.log('in error');
    console.log(response);
    
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
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

/* export const saveOrderOtherPage = async (
  data: any
): Promise<any> => {
  console.log('in save response');
  
  const response = await axios.post<Omit<OtherPageT, 'id'>>('/api/other/save-order', {
    data,
  });

  console.log('response', response);
  

  if (response.status === 200) {
    return {  data: response.data };
  } else {
    console.log('error');
    return;
  }
}; */
