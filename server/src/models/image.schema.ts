import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonSchema } from './helper.models';
import { User } from './user.schema';

export enum AnnotationStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    APPROVAL_PENDING = 'APPROVAL_PENDING',
}

@Schema({ _id: false })
export class Dimensions {
    @Prop({ type: Number, required: true })
    width: number;

    @Prop({ type: Number, required: true })
    height: number;
}

@Schema({ _id: false })
export class AnnotationVertices {
    @Prop({ type: Number, required: true })
    x: number;

    @Prop({ type: Number, required: true })
    y: number;

    @Prop({ type: Number, required: true })
    width: number;

    @Prop({ type: Number, required: true })
    height: number;
}

@Schema()
export class AnnotationDetails {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: AnnotationVertices, default: {} })
    vertices: AnnotationVertices;

    @Prop({ type: Number, required: true })
    confidence: number;
}

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
})
export class Image extends CommonSchema {
    @Prop({ required: true, type: String, select: false })
    path: string;

    @Prop({ type: String, required: true })
    url: string;

    @Prop({ type: String, required: true })
    original_name: string;

    @Prop({ type: String, required: true })
    file_name: string;

    @Prop({ type: Number })
    size: number;

    @Prop({ type: Types.ObjectId, required: true, select: false, ref: User.name })
    user_id: Types.ObjectId;

    @Prop({ enum: AnnotationStatus, default: AnnotationStatus.IN_PROGRESS })
    status: AnnotationStatus;

    @Prop({ type: Dimensions, required: true })
    dimensions: Dimensions;

    @Prop({ type: [AnnotationDetails], default: [] })
    annotations: AnnotationDetails[];
}

export const ImageSchema = SchemaFactory.createForClass(Image);
export type ImageModel = Model<Image>;
