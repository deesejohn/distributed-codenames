// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.0
// 	protoc        v3.12.4
// source: words.proto

package protos

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type Category int32

const (
	Category_UNKNOWN_CATEGORY Category = 0
	Category_NORMAL           Category = 1
	Category_ADULT            Category = 2
)

// Enum value maps for Category.
var (
	Category_name = map[int32]string{
		0: "UNKNOWN_CATEGORY",
		1: "NORMAL",
		2: "ADULT",
	}
	Category_value = map[string]int32{
		"UNKNOWN_CATEGORY": 0,
		"NORMAL":           1,
		"ADULT":            2,
	}
)

func (x Category) Enum() *Category {
	p := new(Category)
	*p = x
	return p
}

func (x Category) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (Category) Descriptor() protoreflect.EnumDescriptor {
	return file_words_proto_enumTypes[0].Descriptor()
}

func (Category) Type() protoreflect.EnumType {
	return &file_words_proto_enumTypes[0]
}

func (x Category) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use Category.Descriptor instead.
func (Category) EnumDescriptor() ([]byte, []int) {
	return file_words_proto_rawDescGZIP(), []int{0}
}

type WordsRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Category Category `protobuf:"varint,1,opt,name=category,proto3,enum=distributed_codenames.Category" json:"category,omitempty"`
}

func (x *WordsRequest) Reset() {
	*x = WordsRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_words_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *WordsRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*WordsRequest) ProtoMessage() {}

func (x *WordsRequest) ProtoReflect() protoreflect.Message {
	mi := &file_words_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use WordsRequest.ProtoReflect.Descriptor instead.
func (*WordsRequest) Descriptor() ([]byte, []int) {
	return file_words_proto_rawDescGZIP(), []int{0}
}

func (x *WordsRequest) GetCategory() Category {
	if x != nil {
		return x.Category
	}
	return Category_UNKNOWN_CATEGORY
}

type WordsResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Category Category `protobuf:"varint,1,opt,name=category,proto3,enum=distributed_codenames.Category" json:"category,omitempty"`
	Words    []string `protobuf:"bytes,2,rep,name=words,proto3" json:"words,omitempty"`
}

func (x *WordsResponse) Reset() {
	*x = WordsResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_words_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *WordsResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*WordsResponse) ProtoMessage() {}

func (x *WordsResponse) ProtoReflect() protoreflect.Message {
	mi := &file_words_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use WordsResponse.ProtoReflect.Descriptor instead.
func (*WordsResponse) Descriptor() ([]byte, []int) {
	return file_words_proto_rawDescGZIP(), []int{1}
}

func (x *WordsResponse) GetCategory() Category {
	if x != nil {
		return x.Category
	}
	return Category_UNKNOWN_CATEGORY
}

func (x *WordsResponse) GetWords() []string {
	if x != nil {
		return x.Words
	}
	return nil
}

var File_words_proto protoreflect.FileDescriptor

var file_words_proto_rawDesc = []byte{
	0x0a, 0x0b, 0x77, 0x6f, 0x72, 0x64, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x15, 0x64,
	0x69, 0x73, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x64, 0x5f, 0x63, 0x6f, 0x64, 0x65, 0x6e,
	0x61, 0x6d, 0x65, 0x73, 0x22, 0x4b, 0x0a, 0x0c, 0x57, 0x6f, 0x72, 0x64, 0x73, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x12, 0x3b, 0x0a, 0x08, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x1f, 0x2e, 0x64, 0x69, 0x73, 0x74, 0x72, 0x69, 0x62,
	0x75, 0x74, 0x65, 0x64, 0x5f, 0x63, 0x6f, 0x64, 0x65, 0x6e, 0x61, 0x6d, 0x65, 0x73, 0x2e, 0x43,
	0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x52, 0x08, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72,
	0x79, 0x22, 0x62, 0x0a, 0x0d, 0x57, 0x6f, 0x72, 0x64, 0x73, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e,
	0x73, 0x65, 0x12, 0x3b, 0x0a, 0x08, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x0e, 0x32, 0x1f, 0x2e, 0x64, 0x69, 0x73, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74,
	0x65, 0x64, 0x5f, 0x63, 0x6f, 0x64, 0x65, 0x6e, 0x61, 0x6d, 0x65, 0x73, 0x2e, 0x43, 0x61, 0x74,
	0x65, 0x67, 0x6f, 0x72, 0x79, 0x52, 0x08, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x12,
	0x14, 0x0a, 0x05, 0x77, 0x6f, 0x72, 0x64, 0x73, 0x18, 0x02, 0x20, 0x03, 0x28, 0x09, 0x52, 0x05,
	0x77, 0x6f, 0x72, 0x64, 0x73, 0x2a, 0x37, 0x0a, 0x08, 0x43, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72,
	0x79, 0x12, 0x14, 0x0a, 0x10, 0x55, 0x4e, 0x4b, 0x4e, 0x4f, 0x57, 0x4e, 0x5f, 0x43, 0x41, 0x54,
	0x45, 0x47, 0x4f, 0x52, 0x59, 0x10, 0x00, 0x12, 0x0a, 0x0a, 0x06, 0x4e, 0x4f, 0x52, 0x4d, 0x41,
	0x4c, 0x10, 0x01, 0x12, 0x09, 0x0a, 0x05, 0x41, 0x44, 0x55, 0x4c, 0x54, 0x10, 0x02, 0x32, 0x65,
	0x0a, 0x0c, 0x57, 0x6f, 0x72, 0x64, 0x73, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x55,
	0x0a, 0x08, 0x47, 0x65, 0x74, 0x57, 0x6f, 0x72, 0x64, 0x73, 0x12, 0x23, 0x2e, 0x64, 0x69, 0x73,
	0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x64, 0x5f, 0x63, 0x6f, 0x64, 0x65, 0x6e, 0x61, 0x6d,
	0x65, 0x73, 0x2e, 0x57, 0x6f, 0x72, 0x64, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a,
	0x24, 0x2e, 0x64, 0x69, 0x73, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x64, 0x5f, 0x63, 0x6f,
	0x64, 0x65, 0x6e, 0x61, 0x6d, 0x65, 0x73, 0x2e, 0x57, 0x6f, 0x72, 0x64, 0x73, 0x52, 0x65, 0x73,
	0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x33, 0x5a, 0x31, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e,
	0x63, 0x6f, 0x6d, 0x2f, 0x64, 0x65, 0x65, 0x73, 0x65, 0x6a, 0x6f, 0x68, 0x6e, 0x2f, 0x64, 0x69,
	0x73, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x64, 0x2d, 0x63, 0x6f, 0x64, 0x65, 0x6e, 0x61,
	0x6d, 0x65, 0x73, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x73, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x33,
}

var (
	file_words_proto_rawDescOnce sync.Once
	file_words_proto_rawDescData = file_words_proto_rawDesc
)

func file_words_proto_rawDescGZIP() []byte {
	file_words_proto_rawDescOnce.Do(func() {
		file_words_proto_rawDescData = protoimpl.X.CompressGZIP(file_words_proto_rawDescData)
	})
	return file_words_proto_rawDescData
}

var file_words_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_words_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_words_proto_goTypes = []interface{}{
	(Category)(0),         // 0: distributed_codenames.Category
	(*WordsRequest)(nil),  // 1: distributed_codenames.WordsRequest
	(*WordsResponse)(nil), // 2: distributed_codenames.WordsResponse
}
var file_words_proto_depIdxs = []int32{
	0, // 0: distributed_codenames.WordsRequest.category:type_name -> distributed_codenames.Category
	0, // 1: distributed_codenames.WordsResponse.category:type_name -> distributed_codenames.Category
	1, // 2: distributed_codenames.WordsService.GetWords:input_type -> distributed_codenames.WordsRequest
	2, // 3: distributed_codenames.WordsService.GetWords:output_type -> distributed_codenames.WordsResponse
	3, // [3:4] is the sub-list for method output_type
	2, // [2:3] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_words_proto_init() }
func file_words_proto_init() {
	if File_words_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_words_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*WordsRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_words_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*WordsResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_words_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_words_proto_goTypes,
		DependencyIndexes: file_words_proto_depIdxs,
		EnumInfos:         file_words_proto_enumTypes,
		MessageInfos:      file_words_proto_msgTypes,
	}.Build()
	File_words_proto = out.File
	file_words_proto_rawDesc = nil
	file_words_proto_goTypes = nil
	file_words_proto_depIdxs = nil
}
