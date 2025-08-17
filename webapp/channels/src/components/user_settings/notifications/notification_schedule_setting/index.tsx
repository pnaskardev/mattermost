// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useRef, memo, useMemo, useCallback} from 'react';
import {FormattedMessage} from 'react-intl';

import type {UserNotifyProps} from '@mattermost/types/users';

import BooleanSetting from 'components/admin_console/boolean_setting';
import SettingsGroup from 'components/admin_console/settings_group';
import SettingItemMax from 'components/setting_item_max';
import type SettingItemMinComponent from 'components/setting_item_min';
import SettingItemMin from 'components/setting_item_min';

import {UserSettingsNotificationSections} from 'utils/constants';

export type Props = {
    active: boolean;
    notificationSchedule: boolean;
    notificationScheduleRadioChange: (notificationSchedule: UserNotifyProps['schedule_notification']) => void;
    updateSection: (section: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    saving: boolean;
    error: string;
    areAllSectionsInactive: boolean;
};

function NotificationScheduleSettings({
    active,
    notificationSchedule,
    notificationScheduleRadioChange,
    updateSection,
    onSubmit,
    onCancel,
    saving,
    error,
    areAllSectionsInactive,

}: Props) {
    const editButtonRef = useRef<SettingItemMinComponent>(null);
    const previousActiveRef = useRef(active);

    // const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    //     // notificationScheduleRadioChange(id, e.target.value === 'true');
    //     notificationScheduleRadioChange(e.target.value === 'true' ? 'true' : 'false');
    // }, [notificationSchedule, notificationScheduleRadioChange]);

    const handleChangeDiff = useCallback((id: string, value: boolean) => {
        notificationScheduleRadioChange(value === true ? 'true' : 'false');
    }, [notificationSchedule, notificationScheduleRadioChange]);

    // handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const enableEmail = e.currentTarget.getAttribute('data-enable-email')!;
    //     const newInterval = parseInt(e.currentTarget.getAttribute('data-email-interval')!, 10);

    //     this.setState({
    //         enableEmail: enableEmail === 'true',
    //         newInterval,
    //     });

    //     a11yFocus(e.currentTarget);

    //     this.props.onChange(enableEmail as UserNotifyProps['email']);
    // };

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
                </fieldset>
                <fieldset>
                    {/* <div className='banner'>
                        <FormattedMessage
                            id={'user.settings.notifications.notificationsScheduleSetting.title'}
                            defaultMessage='Enable notification schedule'
                        />
                    </div> */}
                    <SettingsGroup>
                        <div className='banner'>
                            <FormattedMessage
                                id={'user.settings.notifications.notificationsScheduleSetting.title'}
                                defaultMessage='Enable notification schedule'
                            />
                        </div>
                        <div className='radio'>
                            <BooleanSetting
                                id={'notificationsScheduleBooleanSetting'}
                                label={''}
                                trueText={'On'}
                                falseText={'Off'}
                                value={notificationSchedule}
                                onChange={handleChangeDiff}
                                setByEnv={false}
                                helpText={undefined}
                            />
                        </div>
                    </SettingsGroup>
                    {/* <div className='radio'>
                        <label>
                            <input
                                id='emailNotificationImmediately'
                                type='radio'
                                name='emailNotifications'
                                checked={notificationSchedule}
                                onChange={handleChange}
                            />
                            <FormattedMessage
                                id='user.settings.notifications.email.on'
                                defaultMessage='On'
                            />
                        </label>
                    </div>
                    <div className='radio'>
                        <label>
                            <input
                                id='emailNotificationNever'
                                type='radio'
                                name='emailNotifications'
                                checked={notificationSchedule}
                                onChange={handleChange}
                            />
                            <FormattedMessage
                                id='user.settings.notifications.email.off'
                                defaultMessage='Off'
                            />
                        </label>
                    </div> */}
                </fieldset>
            </>
        );
        maximizedSettingInputs.push(scheduleNotificationSection);
        return maximizedSettingInputs;
    },
    []);

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
