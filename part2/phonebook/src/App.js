import { useState, useEffect } from 'react';
import axios from 'axios';

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

const Persons = (props) => {
  return (
    <div>
      {props.personsToShow.map((person) => (
        <p key={person.id}>{person.name + ' ' + person.number}</p>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    console.log('effect');

    const eventHandler = (response) => {
      console.log('promise fulfilled');
      setPersons(response.data);
    };

    const promise = axios.get('http://localhost:3002/persons');
    promise.then(eventHandler);
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    if (
      persons.every((person) => !areTheseObjectsEqual(person, personObject))
    ) {
      setPersons(persons.concat(personObject));
      setNewName('');
      setNewNumber('');
    } else alert(`${newName} is already added to phonebook`);
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

  function areTheseObjectsEqual(first, second) {
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
  }

  const personsToShow = search
    ? persons.filter(
        (person) => !person.name.toLowerCase().indexOf(search.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
