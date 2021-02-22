import { Clue } from '../../types';

const Hint = (props: { clue: Clue }) => {
  return (
    <div>
      {!props.clue.word ? (
        <div>Waiting for clue</div>
      ) : (
        <div>{props.clue?.word} {props.clue?.number}</div>
      )}
    </div>
  );
};

export default Hint;
