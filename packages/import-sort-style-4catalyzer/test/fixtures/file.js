/* eslint-disable */

import { remove } from 'react-formal/lib/util/ErrorUtils';
import React from 'react';
import { omitExtraProps } from '@qsi/ui/lib/utils/Props';
import Relay from 'react-relay';
import PropTypes from 'prop-types';
import Form from '@qsi/ui/lib/RelayForm';
import Card from '@qsi/ui/lib/Card';
import SampleAssociationFormSection, { fragments as sampleAssocFragments }
  from './SampleAssociationFormSection';
import PageForm from '@qsi/ui-app/lib/PageForm';
import Fieldset from '@qsi/ui/lib/Fieldset';
import getNodes from '@qsi/common/lib/getNodes';
import styles from './foo.css';
import otherStyles from '@qsi/ui/styles/text.css';
import fetchWorkflowParams from 'utils/fetchWorkflowParams';
import theme from '@qsi/ui-theme'
import './styles.css';
import ParamsFormSection from 'components/ParamsFormSection';
import WorkflowInput, { fragments as inputFragments }
  from 'components/WorkflowInput';
import EntityFormSection from 'components/EntityFormSection';
import workflowMessages from 'messages/analysisWorkflow';
import analysisSchema, { deserialize, serialize, setParams, setWorkflow }
  from '../schemas/analysis';
import messages from 'messages/analysis';



