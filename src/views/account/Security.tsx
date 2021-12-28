import React, { useEffect, useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { StyleSheet, View, Alert } from 'react-native'
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import Slider from '@react-native-community/slider'
import { encode as btoa } from 'base-64'
import { Modalize } from 'react-native-modalize'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { useStores, useTheme } from '../../store'
import { TOAST_DURATION } from 'lib/constants'
import { getPinTimeout, updatePinTimeout } from '../utils/pin'
import PIN from '../utils/pin'
import * as rsa from 'lib/crypto/rsa'
import * as e2e from 'lib/crypto/e2e'
import { userPinCode } from '../utils/pin'
import Button from '../common/Button'
import ActionMenu from '../common/ActionMenu'
import BackHeader from '../common/BackHeader'
import Typography from '../common/Typography'
import { setTint } from '../common/StatusBar'
import { reportError } from 'lib/errorHelper'
import ChangePIN from '../onboard/choosePIN'

function Security(props: any) {
    const modalizeRef = useRef<Modalize>(null)
    const [pinTimeout, setPinTimeout] = useState(12)
    const [initialPinTimeout, setInitialPinTimeout] = useState(12)
    const theme = useTheme()
    const { user, contacts, ui } = useStores()
    const [isChangePin, setIsChangePin] = useState<boolean>(false)
    const [isPinChanged, setIsPinChanged] = useState<boolean>(false)

    async function loadPinTimeout() {
        const pt = await getPinTimeout()
        setInitialPinTimeout(pt)
        setPinTimeout(pt)
    }

    useEffect(() => {
        loadPinTimeout()
    }, [])

    function showError(err) {
        Toast.showWithGravity(err, TOAST_DURATION, Toast.CENTER)
    }

    async function exportKeys(pin) {
        try {
            if (!pin) return showError('NO PIN')
            const thePIN = await userPinCode()
            if (pin !== thePIN) return showError('NO USER PIN')

            const priv = await rsa.getPrivateKey()
            if (!priv) return showError('CANT READ PRIVATE KEY')

            const myContactKey = user.contactKey

            const meContact = contacts.contactsArray.find((c) => c.id === user.myid) || {
                contact_key: myContactKey,
            }

            console.log('meContact', meContact)

            let pub: string | null = myContactKey
            if (!pub) {
                pub = meContact && meContact.contact_key
            }

            if (!pub) return showError('CANT FIND CONTACT KEY')

            const ip = user.currentIP
            if (!ip) return showError('CANT FIND IP')

            const token = user.authToken
            if (!token) return showError('CANT FIND TOKEN')

            if (!priv || !pub || !ip || !token) return showError('MISSING A VAR')

            const str = `${priv}::${pub}::${ip}::${token}`
            const enc = await e2e.encrypt(str, pin)
            const final = btoa(`keys::${enc}`)

            Clipboard.setString(final)
            Toast.showWithGravity('Export Keys Copied.', TOAST_DURATION, Toast.CENTER)
            return true
        } catch (e) {
            showError((e as any).message || e)
            reportError(e)
        }
    }

    function pinTimeoutValueUpdated(v) {
        updatePinTimeout(String(v))
    }
    function pinTimeoutValueChange(v) {
        setPinTimeout(v)
    }

    const items = [
        [
            {
                title: 'Set Pin',
                icon: 'ChevronRight',
                action: () => setIsChangePin(true),
            },
        ],
    ]

    async function finish(pin) {
        let isDone = await exportKeys(pin)
        modalizeRef?.current?.close()
        if (isDone) {
            user.setIsPinChanged(false)
            setTint(theme.dark ? 'dark' : 'light')
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Communities' },
                    ],
                })
            );
        }

    }

    const onPinChanged = () => {
        setIsChangePin(false)
        setIsPinChanged(true)
        Toast.showWithGravity('Your PIN has been updated. Please re-export your keys using this new PIN.', Toast.LONG, Toast.TOP)
    }

    // useEffect(() => {
    //     if (user.isPinChanged) Alert.alert(`Your PIN has been updated. Please re-export your keys using this new PIN`)
    // }, [user.isPinChanged])

    return (
        <View style={{ ...styles.wrap, backgroundColor: theme.bg }}>
            <BackHeader title='Security' backDisabled={user.isPinChanged} />
            <ActionMenu items={items} />
            <View style={{ padding: 18 }}>
                <View style={styles.pinTimeoutTextWrap}>
                    <Typography color={theme.subtitle}>PIN Timeout</Typography>
                    <Typography color={theme.title}>
                        {pinTimeout ? pinTimeout : 'Always Require PIN'}
                    </Typography>
                </View>
                <Slider
                    minimumValue={0}
                    maximumValue={24}
                    value={initialPinTimeout}
                    step={1}
                    minimumTrackTintColor={theme.primary}
                    maximumTrackTintColor={theme.primary}
                    thumbTintColor={theme.primary}
                    onSlidingComplete={pinTimeoutValueUpdated}
                    onValueChange={pinTimeoutValueChange}
                />
            </View>

            <View style={styles.bottom}>
                <View style={{ ...styles.exportWrap }}>
                    <Typography
                        color={theme.title}
                        fw='500'
                        textAlign='center'
                        style={{
                            marginBottom: 14,
                        }}
                    >
                        Want to switch devices?
                    </Typography>
                    <View style={{ alignItems: 'center' }}>
                        <Button
                            accessibilityLabel='onboard-welcome-button'
                            onPress={() => {
                                setTimeout(() => {
                                    setTint('dark')
                                }, 200)
                                modalizeRef.current?.open()
                            }}
                            size='large'
                            w='70%'
                            h={50}
                        >
                            <Typography color={theme.white}>Copy key</Typography>
                            <View style={{ width: 12, height: 1 }}></View>
                            <Icon name='key' color={theme.white} size={18} />
                        </Button>
                    </View>
                </View>
            </View>
            <ChangePIN mode='change' onDone={onPinChanged} show={isChangePin} onBack={() => setIsChangePin(false)} />
            <Modalize
                scrollViewProps={{
                    scrollEnabled: false,
                    showsVerticalScrollIndicator: false,
                    stickyHeaderIndices: [0],
                }}
                ref={modalizeRef}
                adjustToContentHeight={true}
                disableScrollIfPossible={true}
                openAnimationConfig={{
                    timing: { duration: 300 },
                }}
                modalTopOffset={getStatusBarHeight() + 30}
            >
                <PIN forceEnterMode={true} onFinish={(pin) => finish(pin)} />
            </Modalize>
        </View>
    )
}

export default observer(Security)

const styles = StyleSheet.create({
    wrap: {
        width: '100%',
        flex: 1,
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    exportWrap: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 40,
    },
    pinTimeoutTextWrap: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingRight: 14,
    },
})
