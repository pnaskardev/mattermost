// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import moment from 'moment';
import React, {memo} from 'react';
import {FormattedMessage} from 'react-intl';
import type {OnChangeValue, SingleValue} from 'react-select';

import type {UserNotifyProps} from '@mattermost/types/users';

import * as Menu from 'components/menu';
import SettingItemMax from 'components/setting_item_max';
import SettingItemMin from 'components/setting_item_min';
import Toggle from 'components/toggle';
import type {FieldsetReactSelect, SelectOption} from 'components/widgets/modals/components/react_select_item';
import ReactSelectItemCreator from 'components/widgets/modals/components/react_select_item';

import {UserSettingsNotificationSections} from 'utils/constants';

type State = {
    selectedPeriod: SelectOption;
    sunEnable: boolean;
    monEnable: boolean;
    tueEnable: boolean;
    wedEnable: boolean;
    thuEnable: boolean;
    friEnable: boolean;
    satEnable: boolean;
    sunStart: {value: string; label: string};
    monStart: {value: string; label: string};
    tueStart: {value: string; label: string};
    wedStart: {value: string; label: string};
    thuStart: {value: string; label: string};
    friStart: {value: string; label: string};
    satStart: {value: string; label: string};
    sunEnd: {value: string; label: string};
    monEnd: {value: string; label: string};
    tueEnd: {value: string; label: string};
    wedEnd: {value: string; label: string};
    thuEnd: {value: string; label: string};
    friEnd: {value: string; label: string};
    satEnd: {value: string; label: string};
    enableCustomDND: boolean;
};

export type Props = {
    active: boolean;
    notificationSchedule: boolean;
    updateSection: (section: string) => void;
    notificationScheduleToggleChange: (notificationSchedule: UserNotifyProps['schedule_notification']) => void;
    onSubmit: () => void;
    onCancel: () => void;
    saving: boolean;
    error: string;
    areAllSectionsInactive: boolean;
};

const period: SelectOption[] = [
    {value: 'every_day', label: 'Every Day'},
    {value: 'weekdays', label: 'Weekdays (Mon - Fri)'},
    {value: 'custom_schedule', label: 'Custom Schedule'},
];

const dateOptions = [
    {value: '09:00', label: '09:00'},
    {value: '09:30', label: '09:30'},
    {value: '10:00', label: '10:00'},
    {value: '10:30', label: '10:30'},
    {value: '11:00', label: '11:00'},
    {value: '11:30', label: '11:30'},
    {value: '12:00', label: '12:00'},
    {value: '12:30', label: '12:30'},
    {value: '13:00', label: '13:00'},
    {value: '13:30', label: '13:30'},
    {value: '14:00', label: '14:00'},
    {value: '14:30', label: '14:30'},
    {value: '15:00', label: '15:00'},
    {value: '15:30', label: '15:30'},
    {value: '16:00', label: '16:00'},
    {value: '16:30', label: '16:30'},
    {value: '17:00', label: '17:00'},
    {value: '17:30', label: '17:30'},
    {value: '18:00', label: '18:00'},
    {value: '18:30', label: '18:30'},
    {value: '19:00', label: '19:00'},
    {value: '19:30', label: '19:30'},
    {value: '20:00', label: '20:00'},
    {value: '20:30', label: '20:30'},
    {value: '21:00', label: '21:00'},
    {value: '21:30', label: '21:30'},
    {value: '22:00', label: '22:00'},
    {value: '22:30', label: '22:30'},
    {value: '23:00', label: '23:00'},
    {value: '23:30', label: '23:30'},
    {value: '00:00', label: '00:00'},
    {value: '00:30', label: '00:30'},
    {value: '01:00', label: '01:00'},
    {value: '01:30', label: '01:30'},
    {value: '02:00', label: '02:00'},
    {value: '02:30', label: '02:30'},
    {value: '03:00', label: '03:00'},
    {value: '03:30', label: '03:30'},
    {value: '04:00', label: '04:00'},
    {value: '04:30', label: '04:30'},
    {value: '05:00', label: '05:00'},
    {value: '05:30', label: '05:30'},
    {value: '06:00', label: '06:00'},
    {value: '06:30', label: '06:30'},
    {value: '07:00', label: '07:00'},
    {value: '07:30', label: '07:30'},
    {value: '08:00', label: '08:00'},
    {value: '08:30', label: '08:30'},
];

class NotificationScheduleSettings extends React.PureComponent<Props, State> {
    editButtonRef = React.createRef<any>();
    previousActive: boolean;

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedPeriod: period[0],
            sunEnable: false,
            monEnable: false,
            tueEnable: false,
            wedEnable: false,
            thuEnable: false,
            friEnable: false,
            satEnable: false,
            sunStart: {value: '09:00', label: '09:00'},
            tueStart: {value: '09:00', label: '09:00'},
            monStart: {value: '09:00', label: '09:00'},
            wedStart: {value: '09:00', label: '09:00'},
            thuStart: {value: '09:00', label: '09:00'},
            friStart: {value: '09:00', label: '09:00'},
            satStart: {value: '09:00', label: '09:00'},
            sunEnd: {value: '18:00', label: '18:00'},
            monEnd: {value: '18:00', label: '18:00'},
            tueEnd: {value: '18:00', label: '18:00'},
            wedEnd: {value: '18:00', label: '18:00'},
            thuEnd: {value: '18:00', label: '18:00'},
            friEnd: {value: '18:00', label: '18:00'},
            satEnd: {value: '18:00', label: '18:00'},
            enableCustomDND: props.notificationSchedule,
        };

        this.previousActive = props.active;
    }
    componentDidUpdate(): void {
        const {active, areAllSectionsInactive} = this.props;

        if (this.previousActive && !active && areAllSectionsInactive) {
            this.editButtonRef.current?.focus();
        }

        this.previousActive = active;
    }

    handlePeriodChange = (selected: OnChangeValue<SelectOption, boolean>) => {
        this.setState({
            selectedPeriod: selected as SelectOption,
        });
    };

    handleToggle = () => {
        const {notificationSchedule, notificationScheduleToggleChange} =
        this.props;
        const newValue = !notificationSchedule;
        notificationScheduleToggleChange(newValue);
    };

    handleChangeForMaxSection = (section: string) => {
        this.props.updateSection(section);
    };

    handleChangeForMinSection = (section: string) => {
        this.props.updateSection(section);
        this.props.onCancel();
    };

    handleDayChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        start: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        end: string,
    ) => {
        const {checked, id} = e.target;
        this.setState({[id.replace('Enable', 'Enable')]: checked} as any);
    };

    handleTimeChange = (option: SingleValue<{value: string; label: string}>, target: string) => {
        if (this.state.selectedPeriod.value === 'every_day') {
            if (target === 'start') {
                this.setState({
                    monStart: option as {value: string; label: string},
                    tueStart: option as {value: string; label: string},
                    wedStart: option as {value: string; label: string},
                    thuStart: option as {value: string; label: string},
                    sunStart: option as {value: string; label: string},
                    friStart: option as {value: string; label: string},
                    satStart: option as {value: string; label: string},
                });
            } else {
                this.setState({
                    sunEnd: option as {value: string; label: string},
                    monEnd: option as {value: string; label: string},
                    tueEnd: option as {value: string; label: string},
                    wedEnd: option as {value: string; label: string},
                    thuEnd: option as {value: string; label: string},
                    friEnd: option as {value: string; label: string},
                    satEnd: option as {value: string; label: string},
                });
            }
        } else if (this.state.selectedPeriod.label === 'weekdays') {
            if (target === 'start') {
                this.setState({
                    tueStart: option as {value: string; label: string},
                    wedStart: option as {value: string; label: string},
                    thuStart: option as {value: string; label: string},
                    friStart: option as {value: string; label: string},
                    monStart: option as {value: string; label: string},
                });
            } else {
                this.setState({
                    tueEnd: option as {value: string; label: string},
                    wedEnd: option as {value: string; label: string},
                    thuEnd: option as {value: string; label: string},
                    friEnd: option as {value: string; label: string},
                    monEnd: option as {value: string; label: string},
                });
            }
        } else {
            // this.setState({
            //     [target]: option ,
            // });
        }
    };

    render() {
        const {
            active,
            notificationSchedule,
            updateSection,
            onSubmit,
            onCancel,
            saving,
            error,
        } = this.props;

        const notificationPeriodData: FieldsetReactSelect = {
            id: 'notification=schedule-select',
            name: 'notificatio-schedule',
            inputId: 'notification-schedule-input',
            dataTestId: 'notification-schedule-select-test',
            ariaLabelledby: 'notification-schedule-label',
            clearable: false,
            options: period,
        };

        function handleChangeForMaxSection(section: string) {
            updateSection(section);
        }

        function handleChangeForMinSection(section: string) {
            updateSection(section);
            onCancel();
        }

        if (active) {
            return (
                <SettingItemMax
                    title={
                        <FormattedMessage
                            id={'user.settings.notifications.notificationsSchedule.title'}
                            defaultMessage='Notifications Schedule'
                        />
                    }
                    inputs={[
                        <>
                            <fieldset
                                id='notificationsScheduleSection'
                                key='notificationsScheduleSection'
                            >
                                <legend className='form-legend'>
                                    <FormattedMessage
                                        id='user.settings.notifications.notificationsSchedule.message'
                                        defaultMessage='Set a schedule for when you want to receive notifications. Outside of the set times, your status will be set to Do Not Disturb and notifications will be disabled.'
                                    />
                                </legend>
                                <div className='ChannelSettingsModal__configurationTab'>
                                    <div className='channel_banner_header'>
                                        <div className='channel_banner_header__text'>
                                            <label
                                                className='Input_legend'
                                                aria-label={'heading'}
                                            >
                                                {notificationSchedule ? 'Disable notification schedule' : 'Enable notification schedule'}
                                            </label>
                                        </div>

                                        <div className='channel_banner_header__toggle'>
                                            <Toggle
                                                id='notificationScheduleToggle'
                                                ariaLabel={'Test'}
                                                size='btn-md'
                                                disabled={false}
                                                onToggle={this.handleToggle}
                                                toggled={notificationSchedule}
                                                tabIndex={0}
                                                toggleClassName='btn-toggle-primary'
                                            />
                                        </div>
                                    </div>
                                </div>
                                {notificationSchedule ? (
                                    <>
                                        <div className='form-select'>
                                            <div className='mt-2'>
                                                <ReactSelectItemCreator
                                                    title='Allow notifications'
                                                    inputFieldData={notificationPeriodData}
                                                    inputFieldValue={this.state.selectedPeriod}
                                                    handleChange={this.handlePeriodChange}
                                                />
                                            </div>
                                        </div>
                                        {this.state.selectedPeriod.value === 'every_day' || this.state.selectedPeriod.value === 'weekdays' ?
                                            (<div className='dateTime mt-4'>
                                                <div
                                                    className='dateTime__time'
                                                >
                                                    <Menu.Container
                                                        menuButton={{
                                                            id: 'time_button',
                                                            dataTestId: 'time_button',
                                                            'aria-label': 'Time',
                                                            class: 'date-time-input',
                                                            children: (
                                                                <>
                                                                    {/* <span className='date-time-input__label'>{'Time'}</span> */}
                                                                    <span className='date-time-input__icon'>{ <i className='icon-clock-outline'/>}</span>
                                                                    <span className='date-time-input__value'>
                                                                        <FormattedMessage
                                                                            id='primary.label'
                                                                            defaultMessage={moment(dateOptions[0].value, 'HH:mm').format('HH:mm')}
                                                                        />
                                                                    </span>
                                                                </>
                                                            ),
                                                        }}
                                                        menu={{
                                                            id: 'expiryTimeMenu',
                                                            'aria-label': 'Choose a time',
                                                            onToggle: () => {},
                                                            width: '200px',
                                                            className: 'time-menu-scrollable',
                                                        }}
                                                    >
                                                        {dateOptions.map((option, index) => (
                                                            <Menu.Item
                                                                key={index}
                                                                id={`time_option_${index}`}
                                                                data-testid={`time_option_${index}`}
                                                                labels={
                                                                    <FormattedMessage
                                                                        id='primary.label'
                                                                        defaultMessage={moment(option.value, 'HH:mm').format('HH:mm')}
                                                                    />
                                                                }
                                                                onClick={() => {}}
                                                            />
                                                        ))}
                                                    </Menu.Container>
                                                </div>
                                                <p className='mt-2'>{'to'}</p>
                                                <div
                                                    className='dateTime__time'
                                                >
                                                    <Menu.Container
                                                        menuButton={{
                                                            id: 'time_button',
                                                            dataTestId: 'time_button',
                                                            'aria-label': 'Time',
                                                            class: 'date-time-input',
                                                            children: (
                                                                <>
                                                                    {/* <span className='date-time-input__label'>{'Time'}</span> */}
                                                                    <span className='date-time-input__icon'>{ <i className='icon-clock-outline'/>}</span>
                                                                    <span className='date-time-input__value'>
                                                                        <FormattedMessage
                                                                            id='primary.label'
                                                                            defaultMessage={moment(dateOptions[0].value, 'HH:mm').format('HH:mm')}
                                                                        />
                                                                    </span>
                                                                </>
                                                            ),
                                                        }}
                                                        menu={{
                                                            id: 'expiryTimeMenu',
                                                            'aria-label': 'Choose a time',
                                                            onToggle: () => {},
                                                            width: '200px',
                                                            className: 'time-menu-scrollable',
                                                        }}
                                                    >
                                                        {dateOptions.map((option, index) => (
                                                            <Menu.Item
                                                                key={index}
                                                                id={`time_option_${index}`}
                                                                data-testid={`time_option_${index}`}
                                                                labels={
                                                                    <FormattedMessage
                                                                        id='primary.label'
                                                                        defaultMessage={moment(option.value, 'HH:mm').format('HH:mm')}
                                                                    />
                                                                }
                                                                onClick={() => {}}
                                                            />
                                                        ))}
                                                    </Menu.Container>
                                                </div>
                                            </div>) : <div className='mt-2'>
                                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                                    <div
                                                        key={day}
                                                        className='dateTime flex align-items-center'
                                                    >
                                                        <div>
                                                            <label className='flex items-center'>
                                                                <input
                                                                    type='checkbox'
                                                                    checked={true}
                                                                    onChange={() => {
                                                                    }}
                                                                />
                                                                <FormattedMessage
                                                                    id='dateSelector_day'
                                                                    defaultMessage={day}
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className='dateTime__time'>
                                                            <Menu.Container
                                                                menuButton={{
                                                                    id: `${day}_time_button_start`,
                                                                    'aria-label': 'Time',
                                                                    class: 'date-time-input',
                                                                    children: (
                                                                        <>
                                                                            <span className='date-time-input__icon'>
                                                                                <i className='icon-clock-outline'/>
                                                                            </span>
                                                                            <span className='date-time-input__value'>
                                                                                <FormattedMessage
                                                                                    id='primary.label'
                                                                                    defaultMessage={moment(dateOptions[0].value, 'HH:mm').format('HH:mm')}
                                                                                />
                                                                            </span>
                                                                        </>
                                                                    ),
                                                                }}
                                                                menu={{
                                                                    id: `${day}_expiryTimeMenu_start`,
                                                                    'aria-label': 'Choose a time',
                                                                    width: '200px',
                                                                    className: 'time-menu-scrollable',
                                                                }}
                                                            >
                                                                {dateOptions.map((option, index) => (
                                                                    <Menu.Item
                                                                        key={index}
                                                                        id={`${day}_time_option_start_${index}`}
                                                                        data-testid={`${day}_time_option_start_${index}`}
                                                                        labels={
                                                                            <FormattedMessage
                                                                                id='primary.label'
                                                                                defaultMessage={moment(option.value, 'HH:mm').format('HH:mm')}
                                                                            />
                                                                        }
                                                                        onClick={() => {}}
                                                                    />
                                                                ))}
                                                            </Menu.Container>
                                                        </div>

                                                        <p className='mx-2 mb-0'>{'to'}</p>

                                                        {/* ---- End Time ---- */}
                                                        <div className='dateTime__time'>
                                                            <Menu.Container
                                                                menuButton={{
                                                                    id: `${day}_time_button_end`,
                                                                    'aria-label': 'Time',
                                                                    class: 'date-time-input',
                                                                    children: (
                                                                        <>
                                                                            <span className='date-time-input__icon'>
                                                                                <i className='icon-clock-outline'/>
                                                                            </span>
                                                                            <span className='date-time-input__value'>
                                                                                <FormattedMessage
                                                                                    id='primary.label'
                                                                                    defaultMessage={moment(dateOptions[0].value, 'HH:mm').format('HH:mm')}
                                                                                />
                                                                            </span>
                                                                        </>
                                                                    ),
                                                                }}
                                                                menu={{
                                                                    id: `${day}_expiryTimeMenu_end`,
                                                                    'aria-label': 'Choose a time',
                                                                    width: '200px',
                                                                    className: 'time-menu-scrollable',
                                                                }}
                                                            >
                                                                {dateOptions.map((option, index) => (
                                                                    <Menu.Item
                                                                        key={index}
                                                                        id={`${day}_time_option_end_${index}`}
                                                                        data-testid={`${day}_time_option_end_${index}`}
                                                                        labels={
                                                                            <FormattedMessage
                                                                                id='primary.label'
                                                                                defaultMessage={moment(option.value, 'HH:mm').format('HH:mm')}
                                                                            />
                                                                        }
                                                                        onClick={() => {}}
                                                                    />
                                                                ))}
                                                            </Menu.Container>
                                                        </div>
                                                    </div>

                                                ))}
                                            </div>
                                        }
                                    </>) : <></>}
                            </fieldset>

                        </>,
                    ]}
                    submit={onSubmit}
                    saving={saving}
                    serverError={error}
                    updateSection={handleChangeForMaxSection}
                />
            );
        }

        return (
            <SettingItemMin
                ref={this.editButtonRef}
                title={
                    <>
                        <FormattedMessage
                            id='user.settings.notifications.notificationsSchedule.title'
                            defaultMessage='Notifications Schedule'
                        />
                    </>
                }
                section={UserSettingsNotificationSections.NOTIFICATION_SCHEDULE}
                updateSection={handleChangeForMinSection}
            />
        );
    }
}

export default memo(NotificationScheduleSettings);
