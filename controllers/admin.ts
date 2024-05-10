import ActionPlan from "../models/ActionPlan"
import Baan from "../models/Baan"
import Camp from "../models/Camp"
import CampStyle from "../models/CampStyle"
import HelthIsue from "../models/HelthIsue"
import NameContainer from "../models/NameContainer"
import NongCamp from "../models/NongCamp"
import Part from "../models/Part"
import PeeCamp from "../models/PeeCamp"
import PetoCamp from "../models/PetoCamp"
import ShertManage from "../models/ShertManage"
import User from "../models/User"
import WorkItem from "../models/WorkItem"
import { InterCamp, InterPart, InterPlace, InterShertManage } from "../models/intreface"
import { calculate, swop } from "./setup"
import express from "express";
import Song from "../models/Song"
import PartNameContainer from '../models/PartNameContainer'
import Place from "../models/Place"
import { getUser } from "../middleware/auth"
import Building from "../models/Building"
import LostAndFound from "../models/LostAndFound"
// export async function addBaan
// export async function addPart
// export async function updateBaan
// export async function createCamp
// export async function forceDeleteCamp
// export async function saveDeleteCamp
// export async function addCampName
// export async function saveDeleteCampName
// export async function forceDeleteCampName
// export async function forceDeleteBaan
// export async function saveDeleteBaan
// export async function saveDeletePart
// export async function forceDeletePart
// export async function addPartName
// export async function saveDeletePartName
// export async function forceDeletePartName
// export async function addAdmin
// export async function getAllAdmin
// export async function downRole
// export async function addMoreBoard
// export async function removeBoard
// export async function createPlace
// export async function saveDeletePlace
// export async function saveDeleteBuilding
export async function addBaan(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const user = await getUser(req)
        const { campId, name, fullName } = req.body
        const camp = await Camp.findById(campId)
        if (user?.role != 'admin' && !user?.authorizeIds.includes(camp?.id)) {
            return res.status(401).json({ success: false })
        }
        const baan = await Baan.create({ campId, name, fullName })
        const nongCamp = await NongCamp.create({ campId, baanId: baan._id })
        baan.updateOne({ nongModelId: nongCamp._id })
        camp?.nongModelIds.push(nongCamp._id.toString())
        camp?.partIds.forEach(async (partId) => {
            const part = await Part.findById(partId)
            const peeCamp = await PeeCamp.create({ campId, baanId: baan._id, partId })
            setDefalse(peeCamp._id.toString())
            part?.peeModelIds.push(peeCamp._id.toString())
            baan.peeModelIds.push(peeCamp._id.toString())
            camp.peeModelIds.push(peeCamp._id.toString())
            baan.mapPeeCampIdByPartId.set(partId, peeCamp._id)
            part?.mapPeeCampIdByBaanId.set(baan._id.toString(), peeCamp._id)
        })
        const campStyle = await CampStyle.create({ refId: baan._id, types: 'baan' })
        camp?.baanIds.push(baan._id.toString())
        baan.updateOne({ styleId: campStyle._id })
        res.status(201).json(baan)
    } catch {
        return res.status(400).json({ success: false })
    }

}
export async function addPart(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { campId, nameId } = req.body

    const camp = await Camp.findById(campId)
    const user = await getUser(req)
    if (user?.role != 'admin' && !user?.authorizeIds.includes(camp?.id)) {
        return res.status(401).json({ success: false })
    }
    const part = await Part.create({ campId, nameId })
    const petoCamp = await PetoCamp.create({ campId, partId: part.id })
    camp?.petoModelIds.push(petoCamp._id.toString())
    camp?.partIds.push(part._id.toString())
    part.updateOne({ petoModelId: petoCamp._id })
    camp?.baanIds.forEach(async (baanId) => {
        const baan = await Baan.findById(baanId)
        const peeCamp = await PeeCamp.create({ baanId, campId, partId: part._id })
        baan?.peeModelIds.push(peeCamp._id.toString())
        camp.peeModelIds.push(peeCamp._id.toString())
        part.peeModelIds.push(peeCamp._id.toString())
        setDefalse(peeCamp._id.toString())
        baan?.mapPeeCampIdByPartId.set(part._id.toString(), peeCamp._id)
        part.mapPeeCampIdByBaanId.set(baanId, peeCamp._id)
    })
    res.status(201).json(part)
}
export async function updateBaan(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        var { name, fullName, baanId, link, girlSleepPlaceId, boySleepPlaceId, nomalPlaceId } = req.body
        const baan = await Baan.findById(baanId)
        const user = await getUser(req)
        if (user?.role != 'admin' && !user?.authorizeIds.includes(baan?.campId as string)) {
            return res.status(401).json({ success: false })
        }
        var boyNew = await Place.findById(boySleepPlaceId)
        var girlNew = await Place.findById(girlSleepPlaceId)
        var normalNew = await Place.findById(nomalPlaceId)
        const boyOld = await Place.findById(baan?.boySleepPlaceId)
        const girlOld = await Place.findById(baan?.girlSleepPlaceId)
        const normalOld = await Place.findById(baan?.nomalPlaceId)
        if (!boyNew) {
            boyNew = boyOld
        }
        if (!girlNew) {
            girlNew = girlOld
        }
        if (!normalNew) {
            normalNew = normalOld
        }
        if (!name) {
            name = baan?.name
        }
        if (!fullName) {
            fullName = baan?.fullName
        }
        if (!link) {
            link = baan?.link
        }
        boyNew?.updateOne({ boySleepBaanIds: swop(null, baan?.id, boyNew.boySleepBaanIds) })
        girlNew?.updateOne({ girlSleepBaanIds: swop(null, baan?.id, girlNew.girlSleepBaanIds) })
        normalNew?.updateOne({ normalBaanIds: swop(null, baan?.id, normalNew.normalBaanIds) })
        boyOld?.updateOne({ boySleepBaanIds: swop(baan?.id, null, boyOld.boySleepBaanIds) })
        girlOld?.updateOne({ girlSleepBaanIds: swop(baan?.id, null, girlOld.girlSleepBaanIds) })
        normalOld?.updateOne({ normalBaanIds: swop(baan?.id, null, normalOld.normalBaanIds) })
        baan?.updateOne({ name, fullName, link, girlSleepPlaceId: girlNew?.id, boySleepPlaceId: boyNew?.id, nomalPlaceId: normalNew?.id })
        res.status(200).json(baan)
    } catch (err) {
        res.status(400).json({ success: false })
    }
}
export async function updatePart(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const { placeId, partId } = req.body
        const baan = await Part.findById(partId)
        const user = await getUser(req)
        if (user?.role != 'admin' && !user?.authorizeIds.includes(baan?.campId as string)) {
            return res.status(401).json({ success: false })
        }
        baan?.updateOne({ placeId })
        res.status(200).json(baan)
    } catch (err) {
        res.status(400).json({ success: false })
    }
}
async function setDefalse(peeCampId: string) {
    const name = ['arrayString1', 'arrayString2', 'arrayString3', 'arrayString4', 'arrayString5', 'map1', 'map2', 'map3', 'map4', 'map5']
    const peeCamp = await PeeCamp.findById(peeCampId)
    peeCamp?.mapArrayStringNumberByName.set(name[0], peeCamp.arrayString1)
    peeCamp?.mapArrayStringNumberByName.set(name[1], peeCamp.arrayString2)
    peeCamp?.mapArrayStringNumberByName.set(name[2], peeCamp.arrayString3)
    peeCamp?.mapArrayStringNumberByName.set(name[3], peeCamp.arrayString4)
    peeCamp?.mapArrayStringNumberByName.set(name[4], peeCamp.arrayString5)
    peeCamp?.mapMapNumberByName.set(name[5], peeCamp.map1)
    peeCamp?.mapMapNumberByName.set(name[6], peeCamp.map2)
    peeCamp?.mapMapNumberByName.set(name[7], peeCamp.map3)
    peeCamp?.mapMapNumberByName.set(name[8], peeCamp.map4)
    peeCamp?.mapMapNumberByName.set(name[9], peeCamp.map5)
}
export async function createCamp(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const { nameId, round, dateStart, dateEnd, boardIds } = req.body
        const camp = await Camp.create({ nameId, round, dateStart, dateEnd, boardIds })
        const campStyle = await CampStyle.create({ refId: camp._id, types: 'camp' })
        camp.updateOne({ campStyleId: campStyle._id })
        boardIds.forEach(async (boardId: string) => {
            const user = await User.findById(boardId)
            user?.authorizeIds.push(camp._id.toString())
        })
        const nameContainer = await NameContainer.findById(nameId)
        nameContainer?.campIds.push(camp._id.toString())
        res.status(201).json(camp)
    } catch (err) {
        res.status(400).json({ success: false })
    }
}
export async function forceDeleteCamp(req: express.Request, res: express.Response, next: express.NextFunction) {
    const campId = req.params.id
    await forceDeleteCampRaw(campId, res)
}
async function forceDeleteCampRaw(campId: string, res: express.Response | null) {


    try {

        const camp = await Camp.findById(campId)
        if (!camp) {
            return res?.status(400).json({ success: false })
        }
        await CampStyle.findByIdAndDelete(camp.campStyleId)
        camp.peeShertManageIds.forEach(async (peeShertManageId) => {
            await ShertManage.findByIdAndDelete(peeShertManageId)
        })
        camp.nongShertManageIds.forEach(async (peeShertManageId) => {
            await ShertManage.findByIdAndDelete(peeShertManageId)
        })
        camp.petoShertManageIds.forEach(async (peeShertManageId) => {
            await ShertManage.findByIdAndDelete(peeShertManageId)
        })
        camp.boardIds.forEach(async (boardId: string) => {
            const user = await User.findById(boardId)
            const news = swop(camp._id.toString(), null, user?.authorizeIds as string[])
            user?.updateOne({ authorizeIds: news })
        })
        camp.nongModelIds.forEach(async (nongModelId) => {
            const nongCamp = await NongCamp.findById(nongModelId)
            nongCamp?.nongIds.forEach(async (userId) => {
                const user = await User.findById(userId)
                const nongCampIds = swop(nongCamp._id.toString(), null, user?.nongCampIds as string[])
                user?.updateOne({ nongCampIds })
            })
            nongCamp?.deleteOne()
        })
        camp.peeModelIds.forEach(async (nongModelId) => {
            const nongCamp = await PeeCamp.findById(nongModelId)
            nongCamp?.peeIds.forEach(async (userId) => {
                const user = await User.findById(userId)
                const peeCampIds = swop(nongCamp._id.toString(), null, user?.peeCampIds as string[])
                user?.updateOne({ peeCampIds })
            })
            nongCamp?.deleteOne()
        })
        camp.petoModelIds.forEach(async (nongModelId) => {
            const nongCamp = await PetoCamp.findById(nongModelId)
            nongCamp?.petoIds.forEach(async (userId) => {
                const user = await User.findById(userId)
                const petoCampIds = swop(nongCamp._id.toString(), null, user?.petoCampIds as string[])
                user?.updateOne({ petoCampIds })
            })
            nongCamp?.deleteOne()
        })
        camp.baanIds.forEach(async (baanId) => {
            const baan = await Baan.findById(baanId)
            baan?.songIds.forEach(async (songId) => {
                const song = await Song.findById(songId)
                song?.updateOne({ baanIds: swop(baan.id, null, song.baanIds) })
            })
            await CampStyle.findByIdAndDelete(baan?.styleId)
            baan?.deleteOne()
        })
        await CampStyle.findByIdAndDelete(camp.campStyleId)
        camp.nongHelthIsueIds.forEach(async (helthueId) => {
            const helthIsue = await HelthIsue.findById(helthueId)
            const user = await User.findById(helthIsue?.userId)
            if (user?.helthIsueId.localeCompare(helthueId)) {
                helthIsue?.deleteOne()
            }
        })
        camp.peeHelthIsueIds.forEach(async (helthueId) => {
            const helthIsue = await HelthIsue.findById(helthueId)
            const user = await User.findById(helthIsue?.userId)
            if (user?.helthIsueId.localeCompare(helthueId)) {
                helthIsue?.deleteOne()
            }
        })
        camp.petoHelthIsueIds.forEach(async (helthueId) => {
            const helthIsue = await HelthIsue.findById(helthueId)
            const user = await User.findById(helthIsue?.userId)
            if (user?.helthIsueId.localeCompare(helthueId)) {
                helthIsue?.deleteOne()
            }
        })
        camp.partIds.forEach(async (partId) => {
            await Part.findByIdAndDelete(partId)
        })
        camp.workItemIds.forEach(async (workItemId) => {
            await WorkItem.findByIdAndDelete(workItemId)
        })
        camp.actionPlanIds.forEach(async (actionPlanId) => {
            await ActionPlan.findByIdAndDelete(actionPlanId)
        })
        const name = await NameContainer.findById(camp.nameId)
        camp.lostAndFoundIds.forEach(async (id)=>{
            const lostAndFound=await LostAndFound.findById(id)
            const user=await User.findById(lostAndFound?.userId)
            user?.updateOne({lostAndFoundIds:swop(lostAndFound?.id,null,user.lostAndFoundIds)})
            const place=await Place.findById(lostAndFound?.placeId)
            place?.updateOne({lostAndFoundIds:swop(lostAndFound?.id,null,place.lostAndFoundIds)})
            const building=await Building.findById(lostAndFound?.buildingId)
            building?.updateOne({lostAndFoundIds:swop(lostAndFound?.id,null,building.lostAndFoundIds)})
            lostAndFound?.deleteOne()
        })
        const campIds = swop(campId, null, name?.campIds as string[])
        name?.updateOne({ campIds })
        camp.deleteOne()
        res?.status(200).json({ success: true })
    } catch (error) {
        res?.status(400).json({ success: false })
    }
}
export async function saveDeleteCamp(req: express.Request, res: express.Response, next: express.NextFunction) {
    const campId: string = req.params.id
    const camp: InterCamp | null = await Camp.findById(campId)
    if (!camp) {
        return res.status(400).json({
            success: false,
            message: 'no camp'
        })
    }
    if (camp.nongPaidIds.length || camp.nongPassIds.size || camp.nongInterviewIds.size || camp.peeIds.length || camp.partIds.length || camp.baanIds.length) {
        return res.status(400).json({ success: false, message: 'this camp is not save to delete' })

    }
    camp.boardIds.forEach(async (boardId: string) => {
        const user = await User.findById(boardId)
        const news = swop(camp.id, null, user?.authorizeIds as string[])
        user?.updateOne({ authorizeIds: news })
    })
    await CampStyle.findByIdAndDelete(camp.campStyleId)
    await Camp.findByIdAndDelete(campId)
    const name = await NameContainer.findById(camp.nameId)
    const campIds = swop(campId, null, name?.campIds as string[])
    name?.updateOne({ campIds })
    res.status(200).json({ success: true })
}
export async function addCampName(req: express.Request, res: express.Response, next: express.NextFunction) {
    const name = await NameContainer.create({ name: req.params.id })
    res.status(201).json(name.toJSON())
}
export async function saveDeleteCampName(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const hospital = await NameContainer.findById(req.params.id)
        res.status(400).json({
            success: false
        });
        if (hospital?.campIds.length) {
            return res.status(400).json({ success: false, massage: 'this not safe to delete' })
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch {
        res.status(400).json({
            success: false
        });
    }
}
export async function forceDeleteCampName(req: express.Request, res: express.Response, next: express.NextFunction) {
    const name = await NameContainer.findById(req.params.id)
    name?.campIds.forEach(async (campId: string) => {
        await forceDeleteCampRaw(campId, null)
    })
    name?.deleteOne()
    res.status(200).json({ success: true })

}
export async function forceDeleteBaan(req: express.Request, res: express.Response, next: express.NextFunction) {
    const baan = await Baan.findById(req.params.id)
    const camp = await Camp.findById(baan?.campId)
    camp?.updateOne({
        baanIds: swop(baan?._id.toString() as string, null, camp.baanIds),
        nongModelIds: swop(baan?.nongModelId as string, null, camp.nongModelIds)
    })
    baan?.nongShertManageIds.forEach(async (shertmanageId) => {
        const shertManage = await ShertManage.findById(shertmanageId)
        const user = await User.findById(shertManage?.userId)
        user?.updateOne({
            shertManageIds: swop(shertmanageId, null, user.shertManageIds)
        })
        camp?.updateOne({
            nongShertManageIds: swop(shertmanageId, null, camp.nongShertManageIds)
        })
        shertManage?.deleteOne()
    })
    baan?.peeShertManageIds.forEach(async (shertmanageId) => {
        const shertManage: InterShertManage | null = await ShertManage.findById(shertmanageId)
        if (!shertManage) {
            return
        }
        const user = await User.findById(shertManage?.userId)
        user?.updateOne({ shertManageIds: swop(shertmanageId, null, user.shertManageIds) })
        camp?.updateOne({ peeShertManageIds: swop(shertmanageId, null, camp.peeShertManageIds) })
        const peeCamp = await PeeCamp.findById(shertManage?.campModelId)
        const part = await Part.findById(peeCamp?.partId)
        part?.updateOne({ peeShertManageIds: swop(shertManage.id, null, part.peeShertManageIds) })
        part?.peeShertSize.set(shertManage.size, calculate(part.peeShertSize.get(shertManage.size), 0, 1))
        await ShertManage.findByIdAndDelete(shertManage.id)
    })
    baan?.nongHelthIsueIds.forEach(async (helthueId) => {
        const helthIsue = await HelthIsue.findById(helthueId)
        const user = await User.findById(helthIsue?.userId)
        if (user?.helthIsueId.localeCompare(helthueId)) {
            helthIsue?.deleteOne()
        }
    })
    baan?.peeHelthIsueIds.forEach(async (helthueId) => {
        const helthIsue = await HelthIsue.findById(helthueId)
        const user = await User.findById(helthIsue?.userId)
        if (user?.helthIsueId.localeCompare(helthueId)) {
            helthIsue?.deleteOne()
        }
    })
    baan?.songIds.forEach(async (songId) => {
        const song = await Song.findById(songId)
        song?.updateOne({ baanIds: swop(baan.id, null, song.baanIds) })
    })
    baan?.peeModelIds.forEach(async (nongModelId) => {
        const nongCamp = await PeeCamp.findById(nongModelId)
        const part = await Part.findById(nongCamp?.partId)
        nongCamp?.peeIds.forEach(async (userId) => {
            const user = await User.findById(userId)
            if (user?.haveBottle) {
                part?.updateOne({ peeHaveBottle: part.peeHaveBottle - 1 })
            }
            const peeCampIds = swop(nongCamp._id.toString(), null, user?.peeCampIds as string[])
            const p = swop(user?._id.toString() as string, null, part?.peeIds as string[])
            part?.updateOne({ peeIds: p })
            const peeIds = swop(user?._id.toString() as string, null, camp?.peeIds as string[])
            camp?.updateOne({ peeIds })
            user?.updateOne({ peeCampIds })
            camp?.peeHaveBottleMapIds.delete(user?.id)
        })
        camp?.updateOne({ peeModelIds: swop(nongModelId, null, camp.peeModelIds) })
        nongCamp?.deleteOne()
    })
    const nongCamp = await NongCamp.findById(baan?.nongModelId)
    nongCamp?.nongIds.forEach(async (userId) => {
        const user = await User.findById(userId)
        const nongCampIds = swop(nongCamp._id.toString(), null, user?.nongCampIds as string[])
        user?.updateOne({ nongCampIds })
        const nongIds = swop(user?._id.toString() as string, null, camp?.nongIds as string[])
        camp?.updateOne({ nongIds })
        camp?.nongHaveBottleMapIds.delete(user?.id)
    })
    camp?.updateOne({ peeHaveBottle: calculate(camp.peeHaveBottle, 0, baan?.peeHaveBottle), nongHaveBottle: calculate(camp.nongHaveBottle, 0, baan?.nongHaveBottle) })
    nongCamp?.deleteOne()
    camp?.nongShertSize.forEach((v, k) => {
        camp.nongShertSize.set(k, calculate(v, 0, baan?.nongShertSize.get(k)))
    })
    const boy = await Place.findById(baan?.boySleepPlaceId)
    boy?.updateOne({ boySleepBaanIds: swop(baan?.id, null, boy.boySleepBaanIds) })
    const girl = await Place.findById(baan?.girlSleepPlaceId)
    girl?.updateOne({ girlSleepBaanIds: swop(baan?.id, null, girl.girlSleepBaanIds) })
    const normal = await Place.findById(baan?.nomalPlaceId)
    normal?.updateOne({ normalBaanIds: swop(baan?.id, null, normal.normalBaanIds) })
    camp?.peeShertSize.forEach((v, k) => {
        camp.peeShertSize.set(k, calculate(v, 0, baan?.peeShertSize.get(k)))
    })
    await CampStyle.findByIdAndDelete(baan?.styleId)
    baan?.deleteOne()
    res.status(200).json({ success: true })
}
export async function saveDeleteBaan(req: express.Request, res: express.Response, next: express.NextFunction) {
    const baan = await Baan.findById(req.params.id)
    const camp = await Camp.findById(baan?.campId)
    const user = await getUser(req)
    if (user?.role != 'admin' && !user?.authorizeIds.includes(camp?.id)) {
        return res.status(401).json({ success: false })
    }
    if (baan?.nongIds.length || baan?.peeIds.length || baan?.songIds.length) {
        return res.status(400).json({ success: false, message: 'this baan is not save to delete' })
    }
    baan?.peeModelIds.forEach(async (peeModelId) => {
        const peeCamp = await PeeCamp.findById(peeModelId)
        camp?.updateOne({ peeModelIds: swop(peeCamp?.id, null, camp.peeModelIds) })
        peeCamp?.deleteOne()
    })
    camp?.updateOne({ nongModelIds: swop(baan?.nongModelId as string, null, camp.nongModelIds) })
    await NongCamp.findByIdAndDelete(baan?.nongModelId)
    await CampStyle.findByIdAndDelete(baan?.styleId)
    baan?.deleteOne()
    res.status(200).json({ success: true })
}
export async function saveDeletePart(req: express.Request, res: express.Response, next: express.NextFunction) {
    const part = await Part.findById(req.params.id)
    const camp = await Camp.findById(part?.campId)
    if (part?.petoIds.length || part?.peeIds.length || part?.actionPlanIds.length || part?.workItemIds.length) {
        return res.status(400).json({ success: false, message: 'this baan is not save to delete' })
    }
    part?.peeModelIds.forEach(async (peeModelId) => {
        const peeCamp = await PeeCamp.findById(peeModelId)
        camp?.updateOne({ peeModelIds: swop(peeCamp?.id, null, camp.peeModelIds) })
        peeCamp?.deleteOne()
    })
    camp?.updateOne({ petoModelIds: swop(part?.petoModelId as string, null, camp.petoModelIds) })
    await NongCamp.findByIdAndDelete(part?.petoModelId)
    part?.deleteOne()
    res.status(200).json({ success: true })
}
export async function forceDeletePart(req: express.Request, res: express.Response, next: express.NextFunction) {
    forceDeletePartRaw(req.params.id)
    res.status(200).json({ success: true })
}
async function forceDeletePartRaw(partId: string) {
    const part = await Part.findById(partId)
    const camp = await Camp.findById(part?.campId)
    camp?.updateOne({
        partIds: swop(part?.id, null, camp.baanIds),
        petoModelIds: swop(part?.petoModelId as string, null, camp.petoModelIds)
    })
    part?.petoShertManageIds.forEach(async (shertmanageId) => {
        const shertManage = await ShertManage.findById(shertmanageId)
        const user = await User.findById(shertManage?.userId)
        user?.updateOne({
            shertManageIds: swop(shertmanageId, null, user.shertManageIds)
        })
        camp?.updateOne({
            petoShertManageIds: swop(shertmanageId, null, camp.petoShertManageIds)
        })
        shertManage?.deleteOne()
    })
    part?.peeShertManageIds.forEach(async (shertmanageId) => {
        const shertManage = await ShertManage.findById(shertmanageId)
        const user = await User.findById(shertManage?.userId)
        user?.updateOne({ shertManageIds: swop(shertmanageId, null, user.shertManageIds) })
        camp?.updateOne({ peeShertManageIds: swop(shertmanageId, null, camp.peeShertManageIds) })
        const peeCamp = await PeeCamp.findById(shertManage?.campModelId)
        const baan = await Baan.findById(peeCamp?.baanId)
        baan?.updateOne({ peeShertManageIds: swop(shertManage?.id, null, part.peeShertManageIds) })
        baan?.peeShertSize.set(shertManage?.size as string, calculate(baan.peeShertSize.get(shertManage?.size as string), 0, 1))
        shertManage?.deleteOne()
    })
    part?.petoHelthIsueIds.forEach(async (helthueId) => {
        const helthIsue = await HelthIsue.findById(helthueId)
        const user = await User.findById(helthIsue?.userId)
        if (user?.helthIsueId.localeCompare(helthueId)) {
            helthIsue?.deleteOne()
        }
    })
    part?.peeHelthIsueIds.forEach(async (helthueId) => {
        const helthIsue = await HelthIsue.findById(helthueId)
        const user = await User.findById(helthIsue?.userId)
        if (user?.helthIsueId.localeCompare(helthueId)) {
            helthIsue?.deleteOne()
        }
    })

    part?.peeModelIds.forEach(async (nongModelId) => {
        const nongCamp = await PeeCamp.findById(nongModelId)
        const baan = await Baan.findById(nongCamp?.baanId)

        nongCamp?.peeIds.forEach(async (userId) => {

            const user = await User.findById(userId)
            if (user?.haveBottle) {
                baan?.updateOne({ peeHaveBottle: baan.peeHaveBottle - 1 })
            }
            const peeCampIds = swop(nongCamp._id.toString(), null, user?.peeCampIds as string[])
            const p = swop(user?.id, null, baan?.peeIds as string[])
            baan?.updateOne({ peeIds: p })
            const peeIds = swop(user?._id.toString() as string, null, camp?.peeIds as string[])
            camp?.updateOne({ peeIds })
            user?.updateOne({ peeCampIds })
            camp?.peeHaveBottleMapIds.delete(user?.id)
        })
        camp?.updateOne({ peeModelIds: swop(nongModelId, null, camp.peeModelIds) })
        nongCamp?.deleteOne()
    })
    const nongCamp = await PetoCamp.findById(part?.petoModelId)
    nongCamp?.petoIds.forEach(async (userId) => {
        const user = await User.findById(userId)
        const petoCampIds = swop(nongCamp.id, null, user?.petoCampIds as string[])
        user?.updateOne({ petoCampIds })
        const nongIds = swop(user?.id, null, camp?.petoIds as string[])
        camp?.updateOne({ petoIds: nongIds })
        camp?.petoHaveBottleMapIds.delete(user?.id)
    })
    camp?.updateOne({ peeHaveBottle: calculate(camp.peeHaveBottle, 0, part?.peeHaveBottle), petoHaveBottle: calculate(camp.petoHaveBottle, 0, part?.petoHaveBottle) })
    nongCamp?.deleteOne()
    camp?.petoShertSize.forEach((v, k) => {
        camp.nongShertSize.set(k, calculate(v, 0, part?.petoShertSize.get(k)))
    })
    camp?.peeShertSize.forEach((v, k) => {
        camp.peeShertSize.set(k, calculate(v, 0, part?.peeShertSize.get(k)))
    })
    part?.actionPlanIds.forEach(async (id) => {
        await ActionPlan.findByIdAndDelete(id)
        camp?.updateOne({ actionPlanIds: swop(id, null, camp.actionPlanIds) })
    })
    part?.workItemIds.forEach(async (id) => {
        const workItem = await WorkItem.findById(id)
        if (workItem?.fromId != 'init') {
            const from = await WorkItem.findById(workItem?.fromId)
            from?.updateOne({ linkOutIds: swop(id, null, from.linkOutIds) })
        }
        deleteWorkingItem(id)
    })
    part?.deleteOne()

}
async function deleteWorkingItem(workItemId: string) {
    const workItem = await WorkItem.findById(workItemId)
    const camp = await Camp.findById(workItem?.campId)
    const part = await Part.findById(workItem?.partId)
    part?.updateOne({ workItemIds: swop(workItem?.id, null, part.workItemIds) })
    camp?.updateOne({ workItemIds: swop(workItem?.id, null, camp.workItemIds) })
    workItem?.linkOutIds.forEach((outId) => {
        if (outId != 'end') {
            deleteWorkingItem(outId)
        }
    })
    workItem?.deleteOne()
}
export async function addPartName(req: express.Request, res: express.Response, next: express.NextFunction) {
    const name = await PartNameContainer.create({ name: req.params.id })
    res.status(201).json({
        success: true,
        data: name
    })
}
export async function saveDeletePartName(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {

        const hospital = await PartNameContainer.findById(req.params.id)
        res.status(400).json({
            success: false
        });
        if (hospital?.campIds.length) {
            return res.status(400).json({ success: false, massage: 'this not safe to delete' })
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch {
        res.status(400).json({
            success: false
        });
    }
}
export async function forceDeletePartName(req: express.Request, res: express.Response, next: express.NextFunction) {
    const partNameContainer = await PartNameContainer.findById(req.params.id)
    partNameContainer?.partIds.forEach((id) => {
        forceDeletePartRaw(id)
    })
    res.status(200).json({ success: true })
}
export async function addAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { userIdsbuf } = req.body
    const userIds: string[] = userIdsbuf
    userIds.forEach(async (userId: string) => {
        const user = await User.findById(userId)
        user?.updateOne({ role: 'admin' })
    })
    res.status(200).json({ success: true })
}
export async function getAllAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const users = await User.find({ role: 'admin' })
    res.status(200).json({ success: true, admins: users })
}
export async function downRole(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = await getUser(req)
    user?.updateOne({ role: req.params.id })
    res.status(200).json({ success: true })
}
export async function addMoreBoard(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { campId, userIds } = req.body
    const camp = await Camp.findById(campId)
    userIds.forEach(async (userId: string) => {
        const user = await User.findById(userId)
        user?.authorizeIds.push(camp?.id)
        camp?.boardIds.push(user?.id)
    });
    res.status(200).json({ success: true })
}
export async function removeBoard(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { campId, userId } = req.body
    const camp = await Camp.findById(campId)
    const user = await User.findById(userId)
    camp?.updateOne({ boardIds: swop(user?.id, null, camp.boardIds) })
    user?.updateOne({ authorizeIds: swop(camp?.id, null, user.authorizeIds) })
}
export async function createPlace(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { room, buildingId } = req.body
    const place = await Place.create({ room, buildingId })
    res.status(201).json(place.toJSON())

}
export async function saveDeletePlace(req: express.Request, res: express.Response, next: express.NextFunction) {
    const place = await Place.findById(req.params.id)
    if (place?.actionPlanIds.length || place?.boySleepBaanIds.length || place?.girlSleepBaanIds.length || place?.normalBaanIds.length || place?.fridayActIds.length || place?.partIds.length) {
        return res.status(400).json({ success: false })
    }
    place?.deleteOne()
    res.status(200).json({ success: true })
}
export async function createBuilding(req: express.Request, res: express.Response, next: express.NextFunction) {
    const building = await Building.create({ name: req.params.id })
    res.status(201).json(building)
}
export async function saveDeleteBuilding(req: express.Request, res: express.Response, next: express.NextFunction) {
    const building = await Building.findById(req.params.id)
    if (building?.placeIds.length) {
        return res.status(400).json({ success: false })
    }
    building?.deleteOne()
}