import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPlaylist, setNonce, setPlaylist, setCreatingPlaylist } from '../../../actions';
import { getDayReleasesMap, getToken, getTokenExpires, getTokenScope } from '../../../selectors';
import { FieldName } from '../../../enums';
import { isValidCreatePlaylistToken, startCreatePlaylistAuthFlow } from '../../../auth';
import { generateNonce, sleep } from '../../../helpers';

export function useReleasesCount(watch) {
  const releases = useSelector(getDayReleasesMap);
  const startDate = watch(FieldName.START_DATE);
  const endDate = watch(FieldName.END_DATE);

  return useMemo(() => {
    if (!startDate || !endDate) {
      return null;
    }

    let current = startDate.clone();
    let count = 0;

    while (current <= endDate) {
      const currentFormatted = current.format('YYYY-MM-DD');

      if (releases[currentFormatted]) {
        count += releases[currentFormatted].length;
      }

      current.add(1, 'day');
    }

    return count;
  }, [releases, startDate, endDate]);
}

export function useOnSubmit(setCancelDisabled) {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const tokenExpires = useSelector(getTokenExpires);
  const tokenScope = useSelector(getTokenScope);

  return useCallback(
    async (formData) => {
      const startDate = formData.startDate.format('YYYY-MM-DD');
      const endDate = formData.endDate.format('YYYY-MM-DD');
      const name = formData.name.trim();
      const description = formData.description ? formData.description.trim() : null;
      const isPrivate = formData.visibility === 'private';

      if (isValidCreatePlaylistToken(token, tokenExpires, tokenScope, isPrivate)) {
        dispatch(createPlaylist());
      } else {
        const nonce = generateNonce();

        setCancelDisabled(true);
        dispatch(setCreatingPlaylist(true));
        dispatch(setNonce(nonce));
        dispatch(setPlaylist(startDate, endDate, name, description, isPrivate));
        await sleep(500);

        startCreatePlaylistAuthFlow(nonce, isPrivate);
      }
    },
    [setCancelDisabled, token, tokenExpires, tokenScope, dispatch]
  );
}
