import { useState, useEffect } from 'react';
import personService from './services/persons';
import Notification from './components/Notification';

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>
        number:{' '}
        <input value={props.newNumber} onChange={props.handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person
          key={person.id}
          id={person.id}
          name={person.name}
          number={person.number}
          deletePerson={() => deletePerson(person.id)}
        />
      ))}
    </div>
  );
};

const Person = ({ id, name, number, deletePerson }) => {
  return (
    <p key={id}>
      {name + ' ' + number + ' '}
      <button onClick={deletePerson}>delete</button>
    </p>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);
  const [messageState, setMessageState] = useState('');

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const samePerson = persons.find((p) => p.name === newName);

    if (samePerson !== undefined && samePerson.number === newNumber) {
      setMessage(`${newName} is already added to the phonebook`);
    } else if (
      samePerson !== undefined &&
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      personService
        .update(samePerson.id, personObject)
        .then((returnObject) => {
          setPersons(
            persons.map((person) =>
              person.id !== samePerson.id ? person : returnObject
            )
          );
          setMessage(`${newName}'s number is changed`);
        })
        .catch((error) => {
          setMessageState('error');
          setMessage(
            `Information of ${newName} has already been removed from server`
          );
          setPersons(persons.filter((p) => p.id !== samePerson.id));
        });
      setTimeout(() => {
        setMessage(null);
        setMessageState('');
      }, 3000);
    } else {
      personService.create(personObject).then((returnObject) => {
        setPersons(persons.concat(returnObject));
      });
      setMessage(`Added ${newName}`);
    }
    setTimeout(() => {
      setMessage(null);
    }, 3000);

    setNewName('');
    setNewNumber('');
  };

  const deletePerson = (id) => {
    if (window.confirm(`Delete ${persons.find((p) => p.id === id).name}?`)) {
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearch(event.target.value);
  };

  /* function areTheseObjectsEqual(first, second) {
    // If the value of either variable is empty
    // we can instantly compare them and check
    // for equality.
    if (
      first === null ||
      first === undefined ||
      second === null ||
      second === undefined
    ) {
      return first === second;
    }

    // If neither are empty, we can check if
    // their constructors are equal. Because
    // constructors are objects, if they are
    // equal, we know the objects are of the
    // same type (though not necessarily of
    // the same value).
    if (first.constructor !== second.constructor) {
      return false;
    }

    // If we reach this point, we know both
    // objects are of the same type so all
    // we need to do is check what type one
    // of the objects is, and then compare
    // them
    if (first instanceof Function || first instanceof RegExp) {
      return first === second;
    }

    // Throught back to the equlity check
    // we started with. Just incase we are
    // comparing simple objects.
    if (first === second || first.valueOf() === second.valueOf()) {
      return true;
    }

    // If the value of check we saw above
    // failed and the objects are Dates,
    // we know they are not Dates because
    // Dates would have equal valueOf()
    // values.
    if (first instanceof Date) return false;

    // If the objects are arrays, we know
    // they are not equal if their lengths
    // are not the same.
    if (Array.isArray(first) && first.length !== second.length) {
      return false;
    }

    // If we have gotten to this point, we
    // need to just make sure that we are
    // working with objects so that we can
    // do a recursive check of the keys and
    // values.
    if (!(first instanceof Object) || !(second instanceof Object)) {
      return false;
    }

    // We now need to do a recursive check
    // on all children of the object to
    // make sure they are deeply equal
    const firstKeys = Object.keys(first);

    // Here we just make sure that all the
    // object keys on this level of the
    // object are the same.
    const allKeysExist = Object.keys(second).every(
      (i) => firstKeys.indexOf(i) !== -1
    );

    // Finally, we pass all the values of our
    // of each object into this function to
    // make sure everything matches
    const allKeyValuesMatch = firstKeys.every((i) =>
      areTheseObjectsEqual(first[i], second[i])
    );

    return allKeysExist && allKeyValuesMatch;
  } */

  const personsToShow = search
    ? persons.filter(
        (person) => !person.name.toLowerCase().indexOf(search.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} state={messageState} />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
