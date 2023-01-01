import { useState, FormEvent } from 'react';
import Autosuggest, {
  ChangeEvent,
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest';

import type { player as PlayerT } from 'services/db';
import styles from './styles.module.scss';

type SuggestionsInputProps = {
  placeholder: string;
  players: PlayerT[];
  onSuggestionClick: (p: PlayerT) => void;
};

const SuggestionsInput = ({
  players,
  placeholder,
  onSuggestionClick,
}: SuggestionsInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [inputSuggestions, setInputSuggestions] = useState<PlayerT[]>([]);

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength >= 3
      ? players.filter(
          (p) =>
            (p?.first_name as string).toLowerCase().slice(0, inputLength) ===
              inputValue ||
            (p?.last_name as string).toLowerCase().slice(0, inputLength) ===
              inputValue
        )
      : [];
  };

  const getSuggestionValue = (s: any) => `${s.first_name[0]}. ${s.last_name}`;

  const onSuggestionsFetchRequested = ({
    value,
  }: SuggestionsFetchRequestedParams) => {
    setInputSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setInputSuggestions([]);
  };

  const onSuggestionSelected = (_: any, v: any) => {
    setInputValue('');
    setInputSuggestions([]);

    onSuggestionClick(v.suggestion);
  };

  const renderSuggestion = (s: PlayerT) => (
    <div>
      {(s?.first_name as string)[0]}. {s?.last_name}
    </div>
  );

  const onChange = (_: FormEvent<HTMLElement>, { newValue }: ChangeEvent) => {
    setInputValue(newValue);
  };

  const inputProps = {
    placeholder,
    value: inputValue,
    onChange,
  };

  return (
    <div className={styles.container}>
      <Autosuggest
        suggestions={inputSuggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />
    </div>
  );
};

export default SuggestionsInput;
