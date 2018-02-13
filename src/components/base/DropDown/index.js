// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import noop from 'lodash/noop'
import Downshift from 'downshift'

import Box from 'components/base/Box'

type ItemType = {
  key: string,
  label: any,
}

type Props = {
  children: any,
  items: Array<ItemType>,
  value?: ItemType | null,
  onChange?: ItemType => void,
}

const Trigger = styled(Box)`
  outline: none;
  cursor: pointer;
`

const Drop = styled(Box).attrs({
  bg: 'white',
  boxShadow: 0,
})`
  position: absolute;
  top: 100%;
  right: 0;
`

const Item = styled(Box).attrs({
  py: 2,
  px: 4,
  bg: p => (p.isHighlighted ? 'pearl' : ''),
})`
  white-space: nowrap;
`

function itemToString(item) {
  return item ? item.label : ''
}

class DropDown extends PureComponent<Props> {
  static defaultProps = {
    value: null,
    onChange: noop,
  }

  renderItems = (items: Array<ItemType>, selectedItem: ItemType, downshiftProps: Object) => {
    const { getItemProps, highlightedIndex } = downshiftProps

    return (
      <Drop>
        {items.map((item, i) => (
          <Item isHighlighted={highlightedIndex === i} key={item.key} {...getItemProps({ item })}>
            {item.label}
          </Item>
        ))}
      </Drop>
    )
  }

  render() {
    const { children, items, value, onChange, ...props } = this.props
    return (
      <Downshift
        onChange={onChange}
        itemToString={itemToString}
        selectedItem={value}
        render={({
          getButtonProps,
          getRootProps,
          isOpen,
          openMenu,
          selectedItem,
          ...downshiftProps
        }) => (
          <Box
            {...getRootProps({ refKey: 'innerRef' })}
            horizontal
            align="center"
            relative
            {...props}
          >
            <Trigger {...getButtonProps()} tabIndex={0}>
              {children}
            </Trigger>
            {isOpen && this.renderItems(items, selectedItem, downshiftProps)}
          </Box>
        )}
      />
    )
  }
}

export default DropDown
