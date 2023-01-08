import { useState, FormEvent } from 'react';
import Autosuggest, {
  ChangeEvent,
  SuggestionsFetchRequestedParams,
} from 'react-autosuggest';
import { AiOutlineSearch } from 'react-icons/ai';

import type { player as PlayerT, tournament as TournamentT } from 'services/db';
import styles from './styles.module.scss';

type SuggestionsInputProps = {
  placeholder: string;
  suggestions: PlayerT[] | TournamentT[];
  filterFn: (inputV: string) => (v: any) => boolean;
  onSuggestionClick: (v: any) => void;
};

const SuggestionsInput = ({
  suggestions,
  placeholder,
  filterFn,
  onSuggestionClick,
}: SuggestionsInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [inputSuggestions, setInputSuggestions] = useState<
    (PlayerT | TournamentT)[]
  >([]);

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    // @ts-ignore
    return inputLength >= 3 ? suggestions.filter(filterFn(inputValue)) : [];
  };

  const getSuggestionValue = (s: any) =>
    s.first_name ? `${s.first_name[0]}. ${s.last_name}` : s.name;

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

  const renderSuggestion = (s: PlayerT | TournamentT) => (
    <div>
      {/* @ts-ignore */}
      {s?.first_name
        ? // @ts-ignore
          `${(s.first_name as string)[0]}. ${s.last_name}`
        : // @ts-ignore
          s?.name}
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

  const noSuggestions = inputValue.length >= 3 && inputSuggestions.length === 0;

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <AiOutlineSearch />
      </div>
      <Autosuggest
        suggestions={inputSuggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />
      {noSuggestions && (
        <div className={styles.noSuggestions}>
          По вашему запросу ничего не найдено
        </div>
      )}
    </div>
  );
};

export default SuggestionsInput;
