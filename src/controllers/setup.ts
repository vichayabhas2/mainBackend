import express from 'express'
import { InterBaanBack, InterBaanFront, InterCampBack, InterCampFront, InterPartBack, InterPartFront, InterSize, InterWorkingItem, InterActionPlan, MapObjectId, MyMap, Size } from '../models/intreface'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'


export function startSize(): Map<'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL', number> {
    const size: Map<'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL', number> = new Map()
    const s: ('S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL')[] = ['S', 'M', 'L', 'XL', 'XXL', '3XL']
    s.forEach((e: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL') => {
        size.set(e, 0)

    })
    return size
}
export function swop(olds: mongoose.Types.ObjectId | null, news: mongoose.Types.ObjectId | null, array: mongoose.Types.ObjectId[]): mongoose.Types.ObjectId[] {
    if (!olds) {
        if (news) {
            array.push(news)
        }
        return array
    }
    const re = array.filter(e => {
        return e.toString().split(' ')[0].localeCompare(olds.toString().split(' ')[0])
    })
    if (news) {
        re.push(news)
    }
    return re
}
export function calculate(input: unknown | number | undefined, plus: | unknown | number | undefined, minus: unknown | number | undefined) {
    return (input as number) + (plus as number) - (minus as number)
}
export const resOk = { success: true }
export const resError = { success: false }
export function sendRes(res: express.Response, success: boolean) {
    res.status(success ? 200 : 400).json({ success })
}
export function sizeMapToJson(input: Map<'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL', number>): InterSize {
    const out: InterSize = {
        _id: null,
        sizeS: input.get('S') as number,
        sizeM: input.get('M') as number,
        sizeL: input.get('L') as number,
        sizeXL: input.get('XL') as number,
        sizeXXL: input.get('XXL') as number,
        size3XL: input.get('3XL') as number
    }
    return (out)
}
export function sizeJsonMod(size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL', count: number, input: InterSize): InterSize {
    switch (size) {
        case 'S': {
            input.sizeS = input.sizeS + count
            break
        }
        case 'M': {
            input.sizeM = input.sizeM + count
            break
        }
        case 'L': {
            input.sizeL = input.sizeL + count
            break
        }
        case 'XL': {
            input.sizeXL = input.sizeXL + count
            break
        }
        case 'XXL': {
            input.sizeXXL = input.sizeXXL + count
            break
        }
        case '3XL': {
            input.size3XL = input.size3XL + count
            break
        }
    }
    return input
}

export function mapBoolToArray(input: Map<mongoose.Types.ObjectId, boolean>): mongoose.Types.ObjectId[] {
    var out: mongoose.Types.ObjectId[] = []
    input.forEach((v: boolean, k: mongoose.Types.ObjectId) => {
        if (v) {
            out.push(k)
        }
    })
    return out

}
export function conBaanBackToFront(input: InterBaanBack): InterBaanFront {
    const {
        name,
        fullName,
        campId,
        peeIds,
        nongIds,
        nongHelthIsueIds,
        peeHelthIsueIds,
        nongShertSize,
        peeShertSize,
        songIds,
        peeModelIds,
        nongModelId,
        nongShertManageIds,
        peeShertManageIds,
        link,
        styleId,
        boySleepPlaceId,
        girlSleepPlaceId,
        mapShertManageIdByUserId,
        nomalPlaceId,
        _id,
        peeSleepIds,
        nongSleepIds,
        groupRef,
        chatIds,
        mdTime,
        peeChatIds,
        nongChatIds,
        nongSendMessage,
        nongHaveBottleIds,
        nongShertManageHaveHelthIshueIds,
        peeHaveBottleIds,
        peeShertManageHaveHelthIshueIds,
    } = input
    return ({
        name,
        fullName,
        campId,
        link,
        nomalPlaceId,
        nongHelthIsueIds,
        nongIds,
        nongModelId,
        nongShertManageIds,
        peeHelthIsueIds,
        peeIds,
        peeShertManageIds,
        peeModelIds,
        peeShertSize: sizeMapToJson(peeShertSize),
        nongShertSize: sizeMapToJson(nongShertSize),
        songIds,
        styleId,
        boySleepPlaceId,
        girlSleepPlaceId,
        mapShertManageIdByUserId: mapObjectIdToMyMap(mapShertManageIdByUserId),
        _id,
        peeSleepIds,
        nongSleepIds,
        groupRef,
        chatIds,
        mdTime,
        peeChatIds,
        nongChatIds,
        nongSendMessage,
        nongHaveBottleIds,
        nongShertManageHaveHelthIshueIds,
        peeHaveBottleIds,
        peeShertManageHaveHelthIshueIds,
    })
}
export function conCampBackToFront(input: InterCampBack): InterCampFront {
    const {
        nameId,
        round,
        dateStart,
        dateEnd,
        boardIds,
        peeIds,
        nongIds,
        partIds,
        petoIds,
        authorizeIds,
        nongHelthIsueIds,
        peeHelthIsueIds,
        petoHelthIsueIds,
        dataLock,
        nongShertSize,
        peeShertSize,
        petoShertSize,
        nongModelIds,
        peeModelIds,
        petoModelIds,
        nongPendingIds,                            /////////////i
        nongPassIds,                               ////////////////////i
        open,
        peePassIds,//<userId,partId>               ////////////////////////i
        songIds,
        nongSureIds,
        baanIds,
        nongShertManageIds,
        peeShertManageIds,
        petoShertManageIds,
        link,
        allDone,
        lockChangePickup,
        pictureUrls,
        campStyleId,
        actionPlanIds,
        workItemIds,
        nongPaidIds,
        nongInterviewIds,                            ////////////////////////////////i
        registerModel,
        memberStructre,
        mapShertManageIdByUserId,
        logoUrl,
        registerSheetLink,
        peeLock,
        outRoundIds,
        campName,
        _id,
        peeSleepIds,
        peeSleepModel,
        nongSleepIds,
        nongSleepModel,
        baanBordId,
        partNameIds,
        partBoardId,
        partCoopId,
        partRegiterId,
        partPeeBaanId,
        peeDataLock,
        petoDataLock,
        groupName,
        actionPlanOffset,
        haveCloth,
        currentNong,
        currentPee,
        nongMapIdGtoL,
        peeMapIdGtoL,
        mdTime,
        partWelfairId,
        partMedId,
        partPlanId,
        allPetoChatIds,
        petoSleepIds,
        nongHaveBottleIds,
        nongMapIdLtoG,
        nongShertManageHaveHelthIshueIds,
        peeHaveBottleIds,
        peeMapIdLtoG,
        peeShertManageHaveHelthIshueIds,
        petoHaveBottleIds,
        petoShertManageHaveHelthIshueIds,

    } = input
    return ({
        partIds,
        open,
        peeHelthIsueIds,
        peeIds,
        peeModelIds,
        peePassIds: mapObjectIdToMyMap(peePassIds),
        peeShertManageIds,
        peeShertSize: sizeMapToJson(peeShertSize),
        petoHelthIsueIds,
        petoIds,
        petoModelIds,
        petoShertManageIds,
        petoShertSize: sizeMapToJson(petoShertSize),
        pictureUrls,
        nameId,
        nongHelthIsueIds,
        nongIds,
        nongInterviewIds: mapStringToMyMap(nongInterviewIds),
        nongModelIds,
        nongPaidIds,
        nongPassIds: mapStringToMyMap(nongPassIds),
        nongPendingIds: mapStringToMyMap(nongPendingIds),
        nongShertManageIds,
        nongShertSize: sizeMapToJson(nongShertSize),
        nongSureIds,
        registerModel,
        round,
        actionPlanIds,
        allDone,
        authorizeIds,
        baanIds,
        boardIds,
        campStyleId,
        link,
        lockChangePickup,
        dataLock,
        dateEnd,
        dateStart,
        memberStructre,
        workItemIds,
        songIds,
        partNameIds,
        logoUrl,
        mapShertManageIdByUserId: mapObjectIdToMyMap(mapShertManageIdByUserId),
        registerSheetLink,
        peeLock,
        outRoundIds,
        campName,
        _id,
        peeSleepIds,
        peeSleepModel,
        nongSleepIds,
        nongSleepModel,
        baanBordId,
        partBoardId,
        partCoopId,
        partRegiterId,
        partPeeBaanId,
        groupName,
        peeDataLock,
        petoDataLock,
        actionPlanOffset,
        haveCloth,
        currentNong,
        currentPee,
        nongMapIdGtoL: mapStringToMyMap(nongMapIdGtoL),
        peeMapIdGtoL: mapStringToMyMap(peeMapIdGtoL),
        mdTime,
        partWelfairId,
        partMedId,
        partPlanId,
        allPetoChatIds,
        petoSleepIds,
        nongHaveBottleIds,
        nongShertManageHaveHelthIshueIds,
        peeHaveBottleIds,
        peeShertManageHaveHelthIshueIds,
        petoHaveBottleIds,
        petoShertManageHaveHelthIshueIds,

    })
}
export function conPartBackToFront(input: InterPartBack): InterPartFront {
    const {
        nameId,
        campId,
        peeIds,
        petoIds,
        peeHelthIsueIds,
        petoHelthIsueIds,
        peeShertSize,
        petoShertSize,
        peeModelIds,
        petoModelId,
        peeShertManageIds,
        petoShertManageIds,
        actionPlanIds,
        workItemIds,
        mapShertManageIdByUserId,
        placeId,
        partName,
        peeSleepIds,
        _id,
        chatIds,
        isAuth,
        petoSleepIds,
        peeHaveBottleIds,
        peeShertManageHaveHelthIshueIds,
        petoHaveBottleIds,
        petoShertManageHaveHelthIshueIds,
    } = input

    return ({
        actionPlanIds,
        workItemIds,
        campId,
        nameId,
        peeHelthIsueIds,
        peeIds,
        peeModelIds,
        peeShertManageIds,
        peeShertSize: sizeMapToJson(peeShertSize),
        petoHelthIsueIds,
        petoIds,
        petoModelId,
        petoShertManageIds,
        petoShertSize: sizeMapToJson(petoShertSize),
        placeId,
        mapShertManageIdByUserId: mapObjectIdToMyMap(mapShertManageIdByUserId),
        partName,
        peeSleepIds,
        _id,
        chatIds,
        isAuth,
        petoSleepIds,
        peeHaveBottleIds,
        peeShertManageHaveHelthIshueIds,
        petoHaveBottleIds,
        petoShertManageHaveHelthIshueIds,
    })
}
export function mapStringToMyMap(input: Map<mongoose.Types.ObjectId, string | number>): MyMap[] {
    var out: MyMap[] = []
    input.forEach((v: string | number, key: mongoose.Types.ObjectId) => {
        out.push({ key, value: v.toString() })
    })
    return out
}
export function mapObjectIdToMyMap(input: Map<mongoose.Types.ObjectId, mongoose.Types.ObjectId>): MapObjectId[] {
    var out: MapObjectId[] = []
    input.forEach((value: mongoose.Types.ObjectId, key: mongoose.Types.ObjectId) => {
        out.push({ key, value })
    })
    return out
}
/*export function myMapToMapString(input: MyMap[]): Map<string, string> {
    const map: Map<string, string> = new Map
    input.forEach((v) => {
        map.set(v.key, v.value)
    })
    return map

}*/
/*export function linkSign(input: InterWorkingItem, token: string): InterWorkingItem {
    const {

        name,
        link,
        status,
        partId,
        campId,
        linkOutIds,
        fromId,
        createBy,
        _id
    } = input
    return ({
        name,
        status,
        campId,
        linkOutIds,
        fromId,
        partId,
        link: jwt.sign(link, token),
        createBy,
        _id
    })
}
function hashRaw(input: string, token: string): string|null {
    try {
        const out = jwt.verify(input, token)
        return(out as {link:string|null}) .link
    } catch (error) {
        return 'null'
    }
}
export function linkHash(input: InterWorkingItem, token: string): InterWorkingItem {
    const {

        name,
        link,
        status,
        partId,
        campId,
        linkOutIds,
        fromId,
        createBy,
        _id
    } = input
    return ({

        name,
        status,
        campId,
        linkOutIds,
        fromId,
        partId,
        link: hashRaw(link, token),
        createBy,
        _id
    })
}*/
export function isInTime(start: Date, end: Date): boolean {
    const now = new Date(Date.now())
    return (now > start && now < end)
}
export function plusActionPlan(input: InterActionPlan, minute: number): InterActionPlan {
    const millisecound = minute * 1000 * 60
    const {
        start,
        end,
        partId,
        placeIds,
        action,
        headId,
        body,
        _id,
        partName
    } = input
    return ({
        start: new Date(start.getTime() + millisecound),
        end: new Date(end.getTime() + millisecound),
        partId,
        placeIds,
        action,
        headId,
        body,
        _id,
        partName
    })
}
export const backendUrl = 'http://localhost:5000'
export const userPath = 'api/v1/auth'
export function removeDupicate(input: mongoose.Types.ObjectId[], compare: mongoose.Types.ObjectId[]): mongoose.Types.ObjectId[] {
    return input.filter((e) => {
        return !compare.includes(e)
    })
}
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    if (value === null || value === undefined) return false;
    const testDummy: TValue = value;
    return true;
}


import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport'

// Create a transport for sending emails (replace with your email service's data)
/*const transporter = nodemailer.createTransport({
    service: '', // Use your email service
    auth: {
     user: '6633227421@student.chula.ac.th', // Your email address
     pass: '67CM37Da', // Your password
    },
});
// Set email options
const mailOptions = {
    from: '6633227421@student.chula.ac.th', // Sender
    to: 'arifmini64@gmail.com', // Recipient
    subject: 'Email Subject', // Email subject
    html: '<></>', // Email HTML content
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Email sending failed:', error);
    } else {
        console.log('Email sent: ' + info.response);
    }
})//nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');*/
export function sendingEmail(email: string, text: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'arifmini64@gmail.com',
            pass: 'mtekbmbboehothcy',
        },
    });
    const mailOptions: MailOptions = {
        from: 'arifmini64@gmail.com',
        to: email,
        subject: "verify email",
        text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email sending failed:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}
export const removeDups = (
    input: mongoose.Types.ObjectId[]
): mongoose.Types.ObjectId[] => {
    var arr = input.map((e) => (e.toString().split(' ')[0]))
    var unique = arr.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })
    return unique.map((e) => new mongoose.Types.ObjectId(e));
}
export function jsonToMapSize(input: InterSize): Map<Size, number> {
    const output = new Map<Size, number>()
    output.set('S', input.sizeS)
    output.set('M', input.sizeM)
    output.set('L', input.sizeL)
    output.set('XL', input.sizeXL)
    output.set('XXL', input.sizeXXL)
    output.set('3XL', input.size3XL)
    return output
}
export function startJsonSize(): InterSize {
    return {
        sizeS: 0,
        sizeM: 0,
        sizeL: 0,
        sizeXL: 0,
        sizeXXL: 0,
        size3XL: 0,
        _id: null
    }
}
export function ifIsTrue(input: boolean, id: mongoose.Types.ObjectId, array: mongoose.Types.ObjectId[]) {
    if (input) {
        array.push(id)
    }
    return array
}
export function ifIsHave(input: mongoose.Types.ObjectId | null, array: mongoose.Types.ObjectId[]) {
    if (input) {
        array.push(input)
    }
    return array
}
export function ifIsPlus(logic: boolean, input: number): number {
    if (logic) {
        return input + 1
    } else {
        return input
    }
}