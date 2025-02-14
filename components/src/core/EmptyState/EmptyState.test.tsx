import React from 'react';
import ReactDOM from 'react-dom';
import { findByTestId } from '../test-utils';
import { Mount, Shallow } from '../types';
import { EmptyState } from './EmptyState';
import Enzyme from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';

import { createMount, createShallow } from '@material-ui/core/test-utils';

Enzyme.configure({ adapter: new Adapter() });
let mount: Mount;
let shallow: Shallow;

describe('EmptyState', () => {
    beforeEach(() => {
        mount = createMount({ strict: true });
        shallow = createShallow({});
    });

    afterEach(() => {
        mount.cleanUp();
    });

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <EmptyState
                icon={<PersonIcon />}
                title="Test"
                description="Test Description"
                actions={<Button> Test </Button>}
            />,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });

    it('renders with frame class', () => {
        const wrapper = shallow(<EmptyState icon={<PersonIcon />} title="Test" />);
        expect(findByTestId('frame', wrapper)).toBeTruthy();
    });

    it('renders with icon', () => {
        const wrapper = shallow(<EmptyState icon={<PersonIcon />} title="Test" />);
        expect(wrapper.find(PersonIcon).length).toEqual(1);
    });

    it('renders with text', () => {
        let wrapper = shallow(<EmptyState icon={<PersonIcon />} title="Test" description="Test Description" />);
        expect(wrapper.find(Typography).length).toEqual(2);
        wrapper = shallow(<EmptyState icon={<PersonIcon />} title="Test" />);
        expect(wrapper.find(Typography).length).toEqual(1);
    });

    it('renders with actions', () => {
        let wrapper = shallow(
            <EmptyState
                icon={<PersonIcon />}
                title="Test"
                description="Test Description"
                actions={<Button> Test </Button>}
            />
        );
        expect(wrapper.find(Button).length).toEqual(1);
        wrapper = shallow(<EmptyState icon={<PersonIcon />} title="Test" description="Test Description" />);
        expect(wrapper.find(Button).length).toEqual(0);
    });
});
