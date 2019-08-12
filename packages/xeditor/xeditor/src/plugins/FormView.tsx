import * as React from 'react'
import { FormBuilder, FieldsBuilder } from '@forestryio/cms-final-form-builder'
import { useCMS, useSubscribable } from '@forestryio/cms-react'
import { useState } from 'react'
import { Form, Plugin } from '@forestryio/cms'
import styled, { createGlobalStyle } from 'styled-components'

export interface ViewPlugin extends Plugin {
  type: 'view'
  Component: any
}

export const FormsView: ViewPlugin = {
  type: 'view',
  name: 'Content',
  Component: () => {
    const cms = useCMS()
    const forms = cms.forms.all()

    const [editingForm, setEditingForm] = useState(() => {
      return cms.forms.all()[0] as Form | null
    })

    useSubscribable(cms.forms, () => {
      const forms = cms.forms.all()
      if (forms.length == 1) {
        setEditingForm(forms[0])
        return
      }

      if (editingForm && forms.findIndex(f => f.name == editingForm.name) < 0) {
        setEditingForm(null)
      }
    })
    return (
      <>
        <FieldsWrapper>
          {!forms.length ? (
            <NoFormsPlaceholder />
          ) : (
            <>
              <ul>
                {forms.map(form => (
                  <li
                    key={form.name}
                    style={{
                      textDecoration:
                        editingForm && editingForm.name === form.name
                          ? 'underline'
                          : 'none',
                    }}
                    onClick={() => {
                      setEditingForm(form)
                    }}
                  >
                    {form.name}
                  </li>
                ))}
              </ul>
              <h3>Editing form {editingForm && editingForm.name}</h3>
              {editingForm &&
                (editingForm.fields.length ? (
                  <FormBuilder form={editingForm}>
                    {() => {
                      return <FieldsBuilder form={editingForm} />
                    }}
                  </FormBuilder>
                ) : (
                  <NoFieldsPlaceholder />
                ))}
            </>
          )}
        </FieldsWrapper>
        <SidebarFooter>
          {editingForm && (
            <SaveButton onClick={() => editingForm.submit()}>Save</SaveButton>
          )}
        </SidebarFooter>
      </>
    )
  },
}

export const DummyView: ViewPlugin = {
  type: 'view',
  name: 'Dummy',
  Component: () => {
    return (
      <FieldsWrapper>
        <h2>Hello World</h2>
      </FieldsWrapper>
    )
  },
}

const NoFormsPlaceholder = () => <p>There is nothing to edit on this page</p>

const NoFieldsPlaceholder = () => (
  <p>There are no fields registered with this form</p>
)

// Styling
const ForestryLogoFile = require('../assets/forestry-logo.svg')
const EllipsisVertical = require('../assets/ellipsis-v.svg')
const HeaderHeight = 5
const FooterHeight = 3

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: ${HeaderHeight}rem;
  padding: 1rem 1rem 0 1rem;
  /* border-bottom: 1px solid #efefef; */
`

const ForestryLogo = styled.div<{ url: string }>`
  height: ${HeaderHeight}rem;
  width: 2rem;
  /* border-right: 1px solid #efefef; */
  background-image: url(${props => props.url});
  background-size: 2rem;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 1rem;
`

const SiteName = styled.h3`
  font-size: 0.8rem;
  font-weight: 500;
`

const ActionsToggle = styled.button`
  background: transparent;
  outline: none;
  border: 0;
  width: 2rem;
  height: ${HeaderHeight}rem;
  margin-left: auto;
  background-image: url(${EllipsisVertical});
  background-position: center;
  background-repeat: no-repeat;
  background-size: 0.3rem;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.6;
  }
`

const FieldsWrapper = styled.div`
  position: absolute;
  left: 0;
  top: ${HeaderHeight}rem;
  height: calc(100vh - (${HeaderHeight + FooterHeight}rem));
  overflow-y: auto;
  padding: 1rem;
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`

const SidebarFooter = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
`

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: ${FooterHeight}rem;
  border: 0;
  background-color: #0085ff;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.6;
  }
`

const RootElement = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  html {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    box-sizing: border-box;
  }
  @supports (font-variation-settings: normal) {
    html { font-family: 'Inter var', sans-serif; }
  }
  body {
    margin: 0;
    padding: 0;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
`