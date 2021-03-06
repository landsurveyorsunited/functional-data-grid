// @flow

import React from 'react'
import BaseColumn from "./BaseColumn"

type CellProps = {
  value: any,
  column : BaseColumn,
  rowIndex : number,
  width : ?number,
  style: Object,
  rowHover: boolean,
  type: 'element' | 'group-header' | 'aggregate',
  content: any,
  originalIndex: number
}

type CellState = {
  hover : boolean
}

const contentStyle = {
  backgroundColor: 'inherit',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  alignSelf: 'center',
  width: '100%'
}

export default class Cell extends React.PureComponent<CellProps, CellState> {

  constructor(props : Object) {
    super(props)
    this.state = {
      hover : false
    }
  }

  render = () => {
    return <div className="functional-data-grid__cell" style={{...this.getCellStyle(), ...this.props.column.style, ...this.props.style}} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
      <div className="functional-data-grid__cell-content" style={contentStyle}>
        { this.renderValue(this.props.column, this.props.type, this.props.content, this.props.originalIndex) }
      </div>
    </div>
  }

  onMouseEnter = () => this.setState({ 'hover': true })
  onMouseLeave = () => this.setState({ 'hover': false })

  renderValue = (c : BaseColumn, type: 'element' | 'group-header' | 'aggregate', content: any, originalIndex: number) => type === 'aggregate'
    ? this.props.value == null ? <span /> : c.aggregateRenderer(this.props.value, content, this.props.rowIndex, originalIndex, this.props.rowHover, this.state.hover)
    : c.renderer(this.props.value, content, this.props.rowIndex, originalIndex, this.props.rowHover, this.state.hover)

  getCellStyle = () => {
    let styles : Object = {
      overflow: 'hidden',
      flexShrink: 0,
      padding: '2px 10px',
      position: 'relative',
      display: 'flex'
    }

    if (this.state.hover) {
      styles.overflow = 'visible'
    }

    if (this.props.width != null)
      styles.width = this.props.width

    return styles
  }
}
