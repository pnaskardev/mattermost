// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useRef, memo, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';

import SettingItemMax from 'components/setting_item_max';
import SettingItemMin from 'components/setting_item_min';
import type SettingItemMinComponent from 'components/setting_item_min';

import {UserSettingsNotificationSections} from 'utils/constants';

export type Props = {
    active: boolean;
    updateSection: (section: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    saving: boolean;
    error: string;
    areAllSectionsInactive: boolean;
};

function NotificationScheduleSettings({
    active,
    updateSection,
    onSubmit,
    onCancel,
    saving,
    error,
    areAllSectionsInactive,

}: Props) {
    const editButtonRef = useRef<SettingItemMinComponent>(null);
    const previousActiveRef = useRef(active);

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
