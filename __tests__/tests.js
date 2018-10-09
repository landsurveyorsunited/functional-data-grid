
import Engine from '../src/Engine'
import { List } from 'immutable'
import Sort from '../src/Sort'
import Filter from '../src/Filter';
import BaseColumn from '../src/BaseColumn'
import Group from '../src/Group';

test('elements are sorted correctly', () => {

  let data = List([
    { position: 2 },
    { position: 3 },
    { position: 1 }
  ])
  let sort = List([new Sort(
    'position',
    'asc'
  )])
  let columns = List([new BaseColumn(
    new BaseColumn({
      id: 'position',
      valueGetter: (e) => e.position
    })
  )])

  let result = Engine.computeElements(data, List(), sort, List(), columns, false, false, null)

  expect(result.get(0).content.position).toBe(1)
  expect(result.get(1).content.position).toBe(2)
  expect(result.get(2).content.position).toBe(3)
})

test('elements are filtered correctly', () => {

  let data = List([
    { name: 'Jack' },
    { name: 'Mark' },
    { name: 'Alice' }
  ])

  let filters = List([new Filter(
    'name',
    (value) => (value == null ? '' : value.toString()).toUpperCase().includes('Ja'.toUpperCase())
  )])

  let columns = List([new BaseColumn(
    new BaseColumn({
      id: 'name',
      valueGetter: (e) => e.name
    })
  )])

  let result = Engine.computeElements(data, List(), List(), filters, columns, false, false, null)

  expect(result.size).toBe(1)
  expect(result.get(0).content.name).toBe('Jack')
})

test('elements are filtered correctly with two filters', () => {

  let data = List([
    { name: 'Jack' },
    { name: 'Mark' },
    { name: 'Alice' }
  ])

  let filters = List([
    new Filter(
      'name',
      (value) => (value == null ? '' : value.toString()).toUpperCase().includes('a'.toUpperCase())
    ),
    new Filter(
      'name',
      (value) => (value == null ? '' : value.toString()).toUpperCase().includes('k'.toUpperCase())
    ),
  ])

  let columns = List([new BaseColumn(
    new BaseColumn({
      id: 'name',
      valueGetter: (e) => e.name
    })
  )])

  let result = Engine.computeElements(data, List(), List(), filters, columns, false, false, null)

  expect(result.size).toBe(2)
  expect(result.get(0).content.name).toBe('Jack')
  expect(result.get(1).content.name).toBe('Mark')
})

test('elements are grouped correctly', () => {

  let data = List([
    { name: 'Jack', gender: 'Male' },
    { name: 'Alice', gender: 'Female' },
    { name: 'Mark', gender: 'Male' }
  ])
  
  let groups = List([
    new Group({
      id: 'gender',
      groupingFunction: e => e.gender
    })
  ])

  let columns = List([new BaseColumn(
    new BaseColumn({
      id: 'name',
      valueGetter: (e) => e.position
    }),
    new BaseColumn({
      id: 'gender',
      valueGetter: (e) => e.gender
    })
  )])

  let result = Engine.computeElements(data, groups, List(), List(), columns, false, false, null)

  expect(result.get(0).content.name).toBe('Alice')
  expect(result.get(1).content.name).toBe('Jack')
  expect(result.get(2).content.name).toBe('Mark')
})
