const { sortImports } = require('import-sort');
const fs = require('fs');
const assert = require('assert');

const style = require('..');
const parser = require('../parser');

let code = fs.readFileSync(`${__dirname}/fixtures/file.js`, 'utf8');

assert(
  sortImports(code, parser, style).code ===
    `/*  eslint-disable */

import createFarceRouter from 'found/lib/createFarceRouter';
import ScrollManager from 'found-scroll/lib/ScrollManager';
import PropTypes from 'prop-types';
import React from 'react';
import { remove } from 'react-formal/lib/util/ErrorUtils';
import Relay from 'react-relay';
import getNodes from '@qsi/common/lib/getNodes';
import Card from '@qsi/ui/lib/Card';
import Fieldset from '@qsi/ui/lib/Fieldset';
import Form from '@qsi/ui/lib/RelayForm';
import { omitExtraProps } from '@qsi/ui/lib/utils/Props';
import PageForm from '@qsi/ui-app/lib/PageForm';
import theme from '@qsi/ui-theme';

import EntityFormSection from 'components/EntityFormSection';
import ParamsFormSection from 'components/ParamsFormSection';
import WorkflowInput, {
  fragments as inputFragments,
} from 'components/WorkflowInput';
import messages from 'messages/analysis';
import workflowMessages from 'messages/analysisWorkflow';
import fetchWorkflowParams from 'utils/fetchWorkflowParams';
import analysisSchema, {
  deserialize,
  serialize,
  setParams,
  setWorkflow,
} from '../schemas/analysis';
import SampleAssociationFormSection, {
  fragments as sampleAssocFragments,
} from './SampleAssociationFormSection';

import './styles.css';
import otherStyles from '@qsi/ui/styles/text.css';
import styles from './foo.css';

const foo = (
  <>
    <div>foo</div>
  </>
);
`,
);

code = fs.readFileSync(`${__dirname}/fixtures/ignore.js`, 'utf8');
assert(sortImports(code, parser, style).code === code);
