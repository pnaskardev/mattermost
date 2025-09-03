// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useRef, memo, useMemo, useCallback} from 'react';
import {FormattedMessage} from 'react-intl';
import type {OnChangeValue} from 'react-select';

import type {UserNotifyProps} from '@mattermost/types/users';

import SettingItemMax from 'components/setting_item_max';
import type SettingItemMinComponent from 'components/setting_item_min';
import SettingItemMin from 'components/setting_item_min';
import Toggle from 'components/toggle';
import type {FieldsetReactSelect, SelectOption} from 'components/widgets/modals/components/react_select_item';
import ReactSelectItemCreator from 'components/widgets/modals/components/react_select_item';

import {UserSettingsNotificationSections} from 'utils/constants';

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

function NotificationScheduleSettings({
    active,
    notificationSchedule,
    notificationScheduleToggleChange,
    updateSection,
    onSubmit,
    onCancel,
    saving,
    error,
    areAllSectionsInactive,

}: Props) {
    const options: SelectOption[] = [
        {value: 'every_day', label: 'Every Day'},
        {value: 'weekdays', label: 'Weekdays'},
        {value: 'custom_schedule', label: 'Custom Schedule'},
    ];

    const inputFieldData: FieldsetReactSelect = {
        id: 'notification=schedule-select',
        name: 'notificatio-schedule',
        inputId: 'notification-schedule-input',
        dataTestId: 'notification-schedule-select-test',
        ariaLabelledby: 'notification-schedule-label',
        clearable: false,
        options,
    };

    const [inputFieldValue, setInputFieldValue] = React.useState<SelectOption>(options[0]);

    const handleChange = (selected: OnChangeValue<SelectOption, boolean>) => {
        if (selected) {
            setInputFieldValue(selected as SelectOption);
        } else {
            setInputFieldValue({value: '', label: ''}); // or null handling
        }
    };

    const editButtonRef = useRef<SettingItemMinComponent>(null);
    const previousActiveRef = useRef(active);

    const handleToggle = useCallback(() => {
        const newValue = !notificationSchedule;
        notificationScheduleToggleChange(newValue as UserNotifyProps['schedule_notification']);
    }, [notificationSchedule, notificationScheduleToggleChange]);

    const maximizedSettingsInputs = useMemo(() => {
        const maximizedSettingInputs = [];
        const scheduleNotificationSection = (
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
                                    onToggle={handleToggle}
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
                                        inputFieldData={inputFieldData}
                                        inputFieldValue={inputFieldValue}
                                        handleChange={handleChange}
                                    />
                                </div>
                            </div>
                        </>) : <></>}
                </fieldset>

            </>
        );
        maximizedSettingInputs.push(scheduleNotificationSection);
        return maximizedSettingInputs;
    },
    [handleToggle, notificationSchedule, inputFieldValue]);

    // Focus back on the edit button, after this section was closed after it was opened
    useEffect(() => {
        if (previousActiveRef.current && !active && areAllSectionsInactive) {
            editButtonRef.current?.focus();
        }

        previousActiveRef.current = active;
    }, [active, areAllSectionsInactive]);

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
                inputs={maximizedSettingsInputs}
                submit={onSubmit}
                saving={saving}
                serverError={error}
                updateSection={handleChangeForMaxSection}
            />
        );
    }

    return (
        <SettingItemMin
            ref={editButtonRef}
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

export default memo(NotificationScheduleSettings);
