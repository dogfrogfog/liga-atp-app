import axios from 'axios';
import type { match as MatchT, digest as DigestT } from '@prisma/client';

export const deleteDigest = async (id: number) => {
  const response = await axios.delete<MatchT>('/api/digests', {
    data: id,
  });

  if (response.status === 200) {
    return { isOk: true };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

export const updateDigest = async (data: DigestT) => {
  const response = await axios.put<DigestT>('/api/digests', { data });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};
