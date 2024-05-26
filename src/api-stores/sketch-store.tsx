import axios, { AxiosResponse } from "axios";
import { fabric } from "fabric";
import { makeAutoObservable } from "mobx";

import { BaseUrl, getRequestConfig } from "@/api-stores/auth-store";

class SketchStore {
    constructor() {
        makeAutoObservable(this);
    }

    async GetAllSketches(): Promise<[]> {
        try {
            const { data }: AxiosResponse = await axios.get(`${BaseUrl}sketches`, getRequestConfig(true));
            return data;
        } catch (e) {
            return [];
        }
    }

    async GetSketchById(id: string): Promise<any> {
        try {
            const { data }: AxiosResponse = await axios.get(`${BaseUrl}sketch/${id}`, getRequestConfig(true));
            return data;
        } catch (e) {
            return null;
        }
    }

    async SaveSketch(sketchMetadata: { version: string; objects: fabric.Object[] }, name: string): Promise<boolean> {
        try {
            await axios.post(
                `${BaseUrl}create`,
                { name, metadata: sketchMetadata, createdBy: "abc" },
                getRequestConfig(true)
            );
            return true;
        } catch (e) {
            return false;
        }
    }

    async UpdateSketch(
        id: string,
        sketchMetadata: { version: string; objects: fabric.Object[] },
        name: string
    ): Promise<boolean> {
        try {
            await axios.post(
                `${BaseUrl}update/${id}`,
                { name, metadata: sketchMetadata, createdBy: "abc" },
                getRequestConfig(true)
            );
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default SketchStore;
