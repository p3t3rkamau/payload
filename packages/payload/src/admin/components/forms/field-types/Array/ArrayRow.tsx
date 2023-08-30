import React from 'react'
import { useTranslation } from 'react-i18next'

import type { UseDraggableSortableReturn } from '../../../elements/DraggableSortable/useDraggableSortable/types.js'
import type { Row } from '../../Form/types.js'
import type { RowLabel as RowLabelType } from '../../RowLabel/types.js'
import type { Props } from './types.js'

import { getTranslation } from '../../../../../utilities/getTranslation.js'
import { ArrayAction } from '../../../elements/ArrayAction/index.js'
import { Collapsible } from '../../../elements/Collapsible/index.js'
import { ErrorPill } from '../../../elements/ErrorPill/index.js'
import { useFormSubmitted } from '../../Form/context.js'
import { createNestedFieldPath } from '../../Form/createNestedFieldPath.js'
import RenderFields from '../../RenderFields/index.js'
import { RowLabel } from '../../RowLabel/index.js'
import HiddenInput from '../HiddenInput/index.js'
import './index.scss'

const baseClass = 'array-field'

type ArrayRowProps = UseDraggableSortableReturn &
  Pick<Props, 'fieldTypes' | 'fields' | 'indexPath' | 'labels' | 'path' | 'permissions'> & {
    CustomRowLabel?: RowLabelType
    addRow: (rowIndex: number) => void
    duplicateRow: (rowIndex: number) => void
    hasMaxRows?: boolean
    moveRow: (fromIndex: number, toIndex: number) => void
    readOnly?: boolean
    removeRow: (rowIndex: number) => void
    row: Row
    rowCount: number
    rowIndex: number
    setCollapse: (rowID: string, collapsed: boolean) => void
  }
export const ArrayRow: React.FC<ArrayRowProps> = ({
  CustomRowLabel,
  addRow,
  attributes,
  duplicateRow,
  fieldTypes,
  fields,
  hasMaxRows,
  indexPath,
  labels,
  listeners,
  moveRow,
  path: parentPath,
  permissions,
  readOnly,
  removeRow,
  row,
  rowCount,
  rowIndex,
  setCollapse,
  setNodeRef,
  transform,
}) => {
  const path = `${parentPath}.${rowIndex}`
  const { i18n } = useTranslation()
  const hasSubmitted = useFormSubmitted()

  const fallbackLabel = `${getTranslation(labels.singular, i18n)} ${String(rowIndex + 1).padStart(
    2,
    '0',
  )}`

  const childErrorPathsCount = row.childErrorPaths?.size
  const fieldHasErrors = hasSubmitted && childErrorPathsCount > 0

  const classNames = [
    `${baseClass}__row`,
    fieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      style={{
        transform,
      }}
      id={`${parentPath.split('.').join('-')}-row-${rowIndex}`}
      key={`${parentPath}-row-${row.id}`}
      ref={setNodeRef}
    >
      <Collapsible
        actions={
          !readOnly ? (
            <ArrayAction
              addRow={addRow}
              duplicateRow={duplicateRow}
              hasMaxRows={hasMaxRows}
              index={rowIndex}
              moveRow={moveRow}
              removeRow={removeRow}
              rowCount={rowCount}
            />
          ) : undefined
        }
        dragHandleProps={{
          attributes,
          id: row.id,
          listeners,
        }}
        header={
          <div className={`${baseClass}__row-header`}>
            <RowLabel
              label={CustomRowLabel || fallbackLabel}
              path={path}
              rowNumber={rowIndex + 1}
            />
            {fieldHasErrors && <ErrorPill count={childErrorPathsCount} withMessage />}
          </div>
        }
        className={classNames}
        collapsed={row.collapsed}
        collapsibleStyle={fieldHasErrors ? 'error' : 'default'}
        onToggle={(collapsed) => setCollapse(row.id, collapsed)}
      >
        <HiddenInput name={`${path}.id`} value={row.id} />
        <RenderFields
          fieldSchema={fields.map((field) => ({
            ...field,
            path: createNestedFieldPath(path, field),
          }))}
          className={`${baseClass}__fields`}
          fieldTypes={fieldTypes}
          indexPath={indexPath}
          permissions={permissions?.fields}
          readOnly={readOnly}
        />
      </Collapsible>
    </div>
  )
}