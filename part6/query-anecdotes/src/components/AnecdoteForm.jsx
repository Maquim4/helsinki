import { useMutation, useQueryClient } from 'react-query';
import { useNotificationDispatch } from '../NotificationContext';
import { create } from '../requests';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const newAnecdoteMutation = useMutation(create, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    const newAnecdote = { content, votes: 0 };
    newAnecdoteMutation.mutate(newAnecdote);
    dispatch({
      type: 'addNotification',
      payload: `anecdote "${content}" created`,
    });
    setTimeout(() => {
      dispatch({
        type: 'rmNotification',
      });
    }, 5000);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
